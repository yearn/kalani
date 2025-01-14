import { parseAbi, zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { useAccount, useConfig, useWaitForTransactionReceipt, useSimulateContract, UseSimulateContractParameters } from 'wagmi'
import { fTokens } from '@kalani/lib/format'
import abis from '@kalani/lib/abis'
import { useCallback, useEffect, useMemo } from 'react'
import Button from '../../../../../components/elements/Button'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { ErrorBoundary } from 'react-error-boundary'

function AsTokens({ balance, decimals, symbol }: { balance: bigint, decimals: number, symbol: string }) {
  return <div className="flex items-end justify-start gap-3">
    <div className="text-4xl">{fTokens(balance, decimals, { fixed: 2 })}</div>
    <div className="text-sm text-neutral-400 whitespace-nowrap">{symbol}</div>
  </div>
}

function AsAssets({ balance }: { balance: bigint }) {
  const { vault } = useVaultFromParams()
  const config = useConfig()
  const toAssetsQuery = useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.address ?? zeroAddress,
      abi: abis.vault,
      functionName: 'convertToAssets',
      args: [balance]
    })
  )
  const decimals = vault?.asset.decimals ?? 12
  return <AsTokens balance={toAssetsQuery.data} decimals={decimals} symbol={vault?.asset.symbol ?? ''} />
}

function useRedeemUnderlying(disabled: boolean) {
  const { vault } = useVaultFromParams()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function redeemUnderlying(address vault)']),
    address: vault?.accountant ?? zeroAddress,
    functionName: 'redeemUnderlying',
    args: [vault?.address ?? zeroAddress],
    query: { enabled: !disabled }
  }), [vault, disabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export default function ClaimFees() {
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const config = useConfig()
  const isFeeRecipient = useMemo(() => compareEvmAddresses(address, accountant.feeRecipient), [address, accountant])

  const balanceQuery = useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.address ?? zeroAddress,
      abi: abis.vault,
      functionName: 'balanceOf',
      args: [vault?.accountant ?? zeroAddress]
    })
  )

  const { simulation, write, confirmation, resolveToast } = useRedeemUnderlying(!isFeeRecipient || balanceQuery.data === 0n)

  const disabled = useMemo(() => {
    return (balanceQuery.data === 0n)
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [balanceQuery, simulation, write, confirmation])

  const buttonTheme = useMemo(() => {
    if (disabled) return 'default'
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [disabled, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
      balanceQuery.refetch()
    }
  }, [confirmation, resolveToast, write, balanceQuery])

  if (!vault) return <></>

  return <div className="flex flex-col gap-6 border-primary border-neutral-900 rounded-primary px-8 py-6">
    <div className="text-sm text-neutral-400">Claimable Fees</div>
    <ErrorBoundary fallback={<AsTokens balance={balanceQuery.data ?? 0n} decimals={vault.asset.decimals} symbol={vault.symbol} />}>
      <AsAssets balance={balanceQuery.data ?? 0n} />
    </ErrorBoundary>
    {isFeeRecipient && <Button disabled={disabled} theme={buttonTheme} onClick={onClick}>Claim</Button>}
  </div>
}