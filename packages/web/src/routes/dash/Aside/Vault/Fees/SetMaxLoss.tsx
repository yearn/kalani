import { zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { useConfig, useWaitForTransactionReceipt, useSimulateContract, UseSimulateContractParameters, useAccount } from 'wagmi'
import abis from '@kalani/lib/abis'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../../../../../components/elements/Button'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { cn } from '../../../../../lib/shadcn'
import InputBps from '../../../../../components/elements/InputBps'
import { useClaim } from './useClaimable'

function useMaxLoss() {
  const { vault } = useVaultFromParams()
  const config = useConfig()
  return useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId ?? 0,
      address: vault?.accountant ?? zeroAddress,
      abi: abis.accountant,
      functionName: 'maxLoss'
    })
  )  
}

function useSetMaxLoss({ maxLoss, disabled }: { maxLoss: bigint, disabled: boolean }) {
  const { vault } = useVaultFromParams()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    chainId: vault?.chainId ?? 0,
    address: vault?.accountant ?? zeroAddress,
    abi: abis.accountant,
    functionName: 'setMaxLoss',
    args: [maxLoss],
    query: { enabled: !disabled }
  }), [vault, disabled, maxLoss])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export default function SetMaxLoss({ className }: { className?: string }) {
  const { address } = useAccount()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const isFeeManager = useMemo(() => compareEvmAddresses(address, accountant.feeManager), [address, accountant])
  const { data: onchainMaxLoss, refetch } = useMaxLoss()
  const { simulation: claimSimulation } = useClaim()
  const claimRefetch = useMemo(() => claimSimulation.refetch, [claimSimulation.refetch])
  const [maxLoss, setMaxLoss] = useState<number | undefined>(Number(onchainMaxLoss))
  const { simulation, write, confirmation, resolveToast } = useSetMaxLoss({ maxLoss: BigInt(maxLoss ?? 0), disabled: !isFeeManager })
  const dirty = useMemo(() => maxLoss !== Number(onchainMaxLoss), [maxLoss, onchainMaxLoss])

  useEffect(() => {
    setMaxLoss(Number(onchainMaxLoss))
  }, [onchainMaxLoss])

  const disabled = useMemo(() => {
    return !isFeeManager
    || !dirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [isFeeManager, dirty, simulation, write, confirmation])

  const buttonTheme = useMemo(() => {
    if (!dirty) return 'default'
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation, dirty])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError, simulation.error])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetch()
      claimRefetch()
    }
  }, [confirmation.isSuccess, resolveToast, refetch, claimRefetch])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className={cn('w-full flex flex-col items-end justify-center gap-3', className)}>
    <div className="w-full px-2 text-sm text-neutral-400 ">Max Loss</div>
    <InputBps isValid={(maxLoss ?? 0) >= 0} bps={maxLoss} onChange={e => setMaxLoss(Number(e.target.value))} disabled={!isFeeManager} outerClassName="w-full" />
    <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="">Set Max Loss</Button>
  </div>
}
