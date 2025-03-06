import { SkeletonButton } from '../../../../../components/Skeleton'
import { Suspense, useEffect, useCallback, useMemo } from 'react'
import { Vault } from '../../../../../hooks/useVault'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import Button from '../../../../../components/elements/Button'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi, zeroAddress } from 'viem'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { EvmAddress, ROLES } from '@kalani/lib/types'
import { useHasRoles } from '../../../../../hooks/useHasRoles'
import { useBreakpoints } from '../../../../../hooks/useBreakpoints'

function useHasReportManagerRole() {
  const { vault } = useVaultFromParams()
  return useHasRoles({
    chainId: vault?.chainId ?? 0,
    vault: vault?.address ?? zeroAddress,
    roleMask: ROLES.REPORTING_MANAGER
  })
}

function useProcessReport(vault: Vault, strategy: EvmAddress, enabled: boolean) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function process_report(address) external view returns (uint256, uint256)']),
    address: vault.address,
    functionName: 'process_report',
    args: [strategy],
    query: { enabled }
  }), [vault, strategy, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function Suspender({ vault, strategy }: { vault: Vault, strategy: EvmAddress }) {
  const authorized = useHasReportManagerRole()
  const { simulation, write, confirmation, resolveToast } = useProcessReport(vault, strategy, authorized)
  const { sm } = useBreakpoints()

  const theme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !authorized 
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
    }
  }, [confirmation, resolveToast, write])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <Button theme={theme} disabled={disabled} onClick={onClick}>
    {sm ? 'Report to vault' : 'Harvest'}
  </Button>
}

export default function ProcessReport({ strategy }: { strategy: EvmAddress }) {
  const { vault } = useVaultFromParams()
  if (!vault) return <></>
  return <Suspense fallback={<SkeletonButton>Exec</SkeletonButton>}>
    <Suspender vault={vault} strategy={strategy} />
  </Suspense>
}
