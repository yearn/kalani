import { zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useWaitForTransactionReceipt, useSimulateContract, UseSimulateContractParameters, useAccount, useBalance } from 'wagmi'
import abis from '@kalani/lib/abis'
import { useCallback, useEffect, useMemo } from 'react'
import Button from '../../../../../components/elements/Button'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { cn } from '../../../../../lib/shadcn'
import { fTokens } from '@kalani/lib/format'

function useDistribute({ disabled }: { disabled: boolean }) {
  const { vault } = useVaultFromParams()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    chainId: vault?.chainId ?? 0,
    address: vault?.accountant ?? zeroAddress,
    abi: abis.accountant,
    functionName: 'distribute',
    args: [vault?.asset.address ?? zeroAddress],
    query: { enabled: !disabled }
  }), [vault, disabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export default function Distribute({ className }: { className?: string }) {
  const { vault } = useVaultFromParams()
  const { address, chainId } = useAccount()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const isFeeManager = useMemo(() => compareEvmAddresses(address, accountant.feeManager), [address, accountant])
  const isOnSameChain = useMemo(() => chainId === vault?.chainId, [chainId, vault?.chainId])
  const authorized = useMemo(() => isFeeManager && isOnSameChain, [isFeeManager, isOnSameChain])
  const { simulation, write, confirmation, resolveToast } = useDistribute({ disabled: !authorized })

  const { data: balance, refetch: refetchBalance } = useBalance({
    address: vault?.accountant ?? zeroAddress,
    token: vault?.asset.address ?? zeroAddress
  })

  const disabled = useMemo(() => {
    return !authorized
    || balance?.value === 0n
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, balance, simulation, write, confirmation])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError, simulation.error])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetchBalance()
    }
  }, [confirmation.isSuccess, resolveToast, refetchBalance])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className={cn('w-full', className)}>
    Distribute {fTokens(balance?.value ?? 0n, balance?.decimals ?? 18, { fixed: 6 })} {balance?.symbol}
  </Button>
}
