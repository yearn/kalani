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

  const toAssetsQuery = useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.address ?? zeroAddress,
      abi: abis.vault,
      functionName: 'convertToAssets',
      args: [balanceQuery.data ?? 0n]
    })
  )

  const { simulation, write, confirmation, resolveToast } = useRedeemUnderlying(!isFeeRecipient || toAssetsQuery.data === 0n)

  const disabled = useMemo(() => {
    return (toAssetsQuery.data === 0n)
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [toAssetsQuery, simulation, write, confirmation])

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

  return <div className="flex flex-col gap-6">
    <div className="text-sm text-neutral-400">Claimable Fees</div>
    <div className="flex items-end justify-start gap-3">
      <div className="text-4xl">{fTokens(toAssetsQuery.data ?? 0n, vault.asset.decimals, { fixed: 4 })}</div>
      <div className="text-sm text-neutral-400">({vault.asset.symbol})</div>
    </div>
    {isFeeRecipient && <Button disabled={disabled} theme={buttonTheme} onClick={onClick}>Claim</Button>}
  </div>
}