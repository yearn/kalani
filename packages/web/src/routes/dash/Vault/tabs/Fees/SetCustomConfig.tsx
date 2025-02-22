import { zeroAddress } from 'viem'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useLocalVaults, useVaultFromParams } from '../../../../../hooks/useVault'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useCallback, useEffect, useMemo } from 'react'
import abis from '@kalani/lib/abis'
import Button from '../../../../../components/elements/Button'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import { EvmAddress } from '@kalani/lib/types'

export type FeeConfigOptions = {
  vault: EvmAddress,
  managementFee: number,
  performanceFee: number,
  refund: number,
  maxFee: number,
  maxGain: number,
  maxLoss: number,
}

export function useSetCustomConfig(options: FeeConfigOptions) {
  const { vault } = useVaultFromParams()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.accountant,
    address: vault?.accountant ?? zeroAddress,
    functionName: 'setCustomConfig',
    args: [
      options.vault,
      options.managementFee,
      options.performanceFee,
      options.refund,
      options.maxFee,
      options.maxGain,
      options.maxLoss
    ]
  }), [vault, options])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export function SetCustomConfig({ feeConfig, className }: { feeConfig: FeeConfigOptions, className?: string }) {
  const { simulation, write, confirmation, resolveToast } = useSetCustomConfig(feeConfig)
  const { query: { refetch: refetchVault }, vault } = useVaultFromParams()
  const { refetch: refetchAccountant } = useAccountantForVaultFromParams()
  const { findLocalVaultOrDefaults, upsertLocalVault } = useLocalVaults()
  const localVault = useMemo(() => findLocalVaultOrDefaults(vault?.chainId ?? 0, vault?.address ?? zeroAddress), [vault, findLocalVaultOrDefaults])

  const isDirty = useMemo(() => {
    return vault?.fees?.managementFee !== feeConfig.managementFee
    || vault?.fees?.performanceFee !== feeConfig.performanceFee
  }, [vault, feeConfig])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !isDirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [isDirty, simulation, write, confirmation])

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
      refetchVault()
      refetchAccountant()
      upsertLocalVault({ ...localVault, fees: feeConfig })
    }
  }, [confirmation, resolveToast, write, refetchVault, refetchAccountant, localVault, upsertLocalVault, feeConfig])

  return <Button theme={buttonTheme} disabled={disabled} onClick={onClick} className={className}>
    Update fees
  </Button>
}
