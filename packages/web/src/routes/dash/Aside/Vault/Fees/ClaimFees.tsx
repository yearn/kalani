import { formatUnits, zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { useAccount, useConfig } from 'wagmi'
import abis from '@kalani/lib/abis'
import { useCallback, useEffect, useMemo } from 'react'
import Button from '../../../../../components/elements/Button'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import { ErrorBoundary } from 'react-error-boundary'
import SetMaxLoss from './SetMaxLoss'
import { useClaim, useClaimable } from './useClaimable'
import Distribute from './Distribute'
import Odometer from 'react-odometerjs'

function AsTokens({ balance, decimals, symbol }: { balance: bigint, decimals: number, symbol: string }) {
  return <div className="flex flex-col items-end justify-start gap-3">
    <div className="text-4xl">
      <Odometer value={Number(formatUnits(balance, decimals))} format="(,ddd).dddddd" />
    </div>
    <div className="text-xl text-neutral-400 whitespace-nowrap">{symbol}</div>
  </div>
}

function AsAssets({ balance }: { balance: bigint }) {
  const { vault } = useVaultFromParams()
  const config = useConfig()
  const toAssetsQuery = useSuspenseQuery({
    ...readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.address ?? zeroAddress,
      abi: abis.vault,
      functionName: 'convertToAssets',
      args: [balance]
    }),
    refetchInterval: 5000
  })
  const decimals = vault?.asset.decimals ?? 18
  return <AsTokens balance={toAssetsQuery.data} decimals={decimals} symbol={vault?.asset.symbol ?? ''} />
}

export default function ClaimFees() {
  const { address, chainId } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const isFeeRecipient = useMemo(() => compareEvmAddresses(address, accountant.feeRecipient), [address, accountant])
  const isOnSameChain = useMemo(() => chainId === vault?.chainId, [chainId, vault?.chainId])
  const authorized = useMemo(() => isFeeRecipient && isOnSameChain, [isFeeRecipient, isOnSameChain])
  const claimable = useClaimable()
  const { simulation, write, confirmation, resolveToast } = useClaim()

  const disabled = useMemo(() => {
    return !authorized
    || (claimable.data === 0n)
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, claimable, simulation, write, confirmation])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

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
      claimable.refetch()
    }
  }, [confirmation, resolveToast, write, claimable])

  const simError = useMemo(() => {
    if (!(simulation.isError && simulation.error)) return null
    const match = simulation.error.message.match(/reverted with the following reason:\s*([\s\S]*?)\s*Contract Call:/)
    return match ? match[1] : null
  }, [simulation])

  if (!vault) return <></>

  return <div className="flex flex-col gap-12 sm:border-primary border-black rounded-primary px-8 py-6">
    <div className="flex flex-col gap-6">
      <div className="text-sm text-neutral-400">Claimable fees</div>
      <ErrorBoundary fallback={<AsTokens balance={claimable.data ?? 0n} decimals={vault.asset.decimals} symbol={vault.symbol} />}>
        <AsAssets balance={claimable.data ?? 0n} />
      </ErrorBoundary>
      {authorized && <div className="flex flex-col gap-2">
        <Button disabled={disabled} theme={buttonTheme} onClick={onClick}>Claim</Button>
        <div data-visible={!!simError} className="data-[visible=false]:invisible px-4 text-xs text-error-400 text-right">{simError ?? 'error'}</div>
      </div>}
      {authorized && <SetMaxLoss />}
    </div>

    {authorized && <Distribute />}
  </div>
}