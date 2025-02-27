import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import abis from '@kalani/lib/abis'
import { useRelayers } from '../../relayers'
import { Suspense, useCallback, useEffect, useMemo } from 'react'
import { useIsRelayed } from './useIsRelayed'
import { useWhitelist } from '../../useWhitelist'
import { EvmAddress, ROLES } from '@kalani/lib/types'
import Button from '../../../../../../../components/elements/Button'
import { fEvmAddress } from '@kalani/lib/format'
import { useWriteContract } from '../../../../../../../hooks/useWriteContract'
import { PiCheck } from 'react-icons/pi'
import StepLabel from '../../../../../../../components/forms/StepLabel'

function useWrite(args: {
  vault: EvmAddress,
  rolemask: bigint,
  enabled: boolean
}) {
  const { vault, rolemask, enabled } = args
  const [relayer] = useRelayers()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address: vault, abi: abis.vault, functionName: 'set_role',
    args: [relayer, rolemask],
    query: { enabled }
  }), [relayer, enabled, rolemask, vault])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function ExecButton({ target }: { target: EvmAddress }) {
  const { refetch: refetchAreAllRelayed } = useIsRelayed({ rolemask: ROLES.REPORTING_MANAGER })
  const { data: isRelayed, refetch: refetchIsRelayed } = useIsRelayed({ vault: target, rolemask: ROLES.REPORTING_MANAGER })
  const { simulation, write, confirmation, resolveToast } = useWrite({ vault: target, rolemask: ROLES.REPORTING_MANAGER, enabled: true })

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disableButton = useMemo(() => 
    simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [simulation, write, confirmation])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetchAreAllRelayed()
      refetchIsRelayed()
    }
  }, [confirmation, resolveToast, refetchAreAllRelayed, refetchIsRelayed])

  if (isRelayed) return <div className="h-[42px] py-3 flex items-center justify-center text-green-400 text-sm"><PiCheck /></div>

  return <Button theme={buttonTheme} disabled={disableButton} onClick={onClick}>Exec</Button>
}

function Target({ target, rolemask }: { target: EvmAddress, rolemask: bigint }) {
  const [relayer] = useRelayers()
  return <div className="px-6 flex flex-wrap items-center justify-end">
    <div className="grow flex flex-wrap gap-0">
      <span className="text-neutral-400">Vault</span>
      <span className="text-neutral-600">(</span>
      {fEvmAddress(target)}
      <span className="text-neutral-600">)</span>.
      <span className="font-bold text-secondary-400">set_role</span>
      <span className="text-neutral-600">(</span>
        {fEvmAddress(relayer)}, {rolemask.toString()}
      <span className="text-neutral-600">)</span>
    </div>
    <Suspense fallback={<></>}>
      <ExecButton target={target} />
    </Suspense>
  </div>
}

export default function SetRoles({ rolemask }: { rolemask: bigint }) {
  const { targets } = useWhitelist()
  return <div className="flex items-start gap-12">
    <StepLabel step={2} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Grant yHaaS relayer the reporting role</p>
      <div className="flex flex-col gap-2">
        {targets.map((target, index) => <Target key={index} target={target} rolemask={rolemask} />)}
      </div>
    </div>
  </div>
}
