import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { zeroAddress } from 'viem'
import abis from '@kalani/lib/abis'
import { useRelayers } from '../../relayers'
import { Suspense, useCallback, useEffect, useMemo } from 'react'
import { useIsRelayed } from './useIsRelayed'
import { useWhitelist } from '../../useWhitelist'
import { EvmAddress } from '@kalani/lib/types'
import Button from '../../../../../../../components/elements/Button'
import { fEvmAddress } from '@kalani/lib/format'
import { useWriteContract } from '../../../../../../../hooks/useWriteContract'
import { PiCheck } from 'react-icons/pi'
import StepLabel from '../../../../../../../components/forms/StepLabel'

function useWrite(
  address: EvmAddress,
  enabled: boolean
) {
  const [relayer] = useRelayers()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.strategy, address,
    functionName: 'setKeeper',
    args: [relayer],
    query: { enabled }
  }), [relayer, enabled, address])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function ExecButton({ target }: { target: EvmAddress }) {
  const { refetch: refetchAreAllRelayed } = useIsRelayed()
  const { data: isRelayed, refetch: refetchIsRelayed } = useIsRelayed({ strategy: target })
  const { simulation, write, confirmation, resolveToast } = useWrite(target, true)

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

function Target({ target }: { target: EvmAddress }) {
  const [relayer] = useRelayers()
  return <div className="px-6 flex flex-wrap items-center justify-end">
    <div className="grow flex flex-wrap gap-0">
      <span className="text-neutral-400">Strategy</span>
      <span className="text-neutral-600">(</span>
      {fEvmAddress(target)}
      <span className="text-neutral-600">)</span>.
      <span className="font-bold text-secondary-400">setKeeper</span>
      <span className="text-neutral-600">(</span>
      {fEvmAddress(relayer ?? zeroAddress)}
      <span className="text-neutral-600">)</span>
    </div>
    <Suspense fallback={<></>}>
      <ExecButton target={target} />
    </Suspense>
  </div>
}

export default function SetKeepers() {
  const { targets } = useWhitelist()
  return <div className="flex items-start gap-12">
    <StepLabel step={2} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Set keepers to yHaaS relayer</p>
      <div className="flex flex-col gap-3">
        {targets.map((target, index) => <Target key={index} target={target} />)}
      </div>
    </div>
  </div>
}
