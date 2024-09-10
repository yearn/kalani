import { useAccount, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import SetAddress from '../../../../../../components/SetAddress'
import { zeroAddress } from 'viem'
import abis from '../../../../../../lib/abis'
import { useRelayer } from '../../relayers'
import { Suspense, useCallback, useEffect, useMemo } from 'react'
import { useIsManagement } from './useIsManagement'
import { useIsRelayed } from './useIsRelayed'
import { useWhitelist } from '../../provider'
import { EvmAddress } from '@kalani/lib/types'
import Button from '../../../../../../components/elements/Button'
import { fEvmAddress } from '../../../../../../lib/format'
import { useWriteContract } from '../../../../../../hooks/useWriteContract'
import { PiCheck } from 'react-icons/pi'

function SingleTarget({ target }: { target: EvmAddress }) {
  const { address, chainId } = useAccount()
  const { data: permitted } = useIsManagement()
  const { data: isRelayed, refetch: refetchIsRelayed } = useIsRelayed({})
  const relayer = useRelayer()

  const onConfirm = useCallback(() => refetchIsRelayed(), [refetchIsRelayed])

  if (!(address && chainId && relayer)) return <></>

  return <div className="flex flex-col gap-6">
    <p>Set your keeper to the yHaaS relayer</p>
    <SetAddress
      to={relayer}
      verb="Set"
      permitted={permitted}
      checked={isRelayed}
      onConfirm={onConfirm}
      contract={{
        chainId,
        address: target ?? zeroAddress,
        abi: abis.strategy,
        get: 'keeper',
        set: 'setKeeper',
      }}
    />
  </div> 
}

function useWrite(
  address: EvmAddress,
  enabled: boolean
) {
  const relayer = useRelayer()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.strategy,
    address,
    functionName: 'setKeeper',
    args: [relayer],
    query: { enabled }
  }), [relayer, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function ExecButton({ target }: { target: EvmAddress }) {
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
      refetchIsRelayed()
    }
  }, [confirmation, resolveToast, refetchIsRelayed])

  if (isRelayed) return <div className="flex items-center justify-center text-green-400"><PiCheck /></div>

  return <Button theme={buttonTheme} disabled={disableButton} onClick={onClick}>exec</Button>
}

function Target({ target }: { target: EvmAddress }) {
  const relayer = useRelayer()
  return <div className="px-6 flex items-center justify-end ">
    <div className="grow">
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

function MultipleTargets({ targets }: { targets: EvmAddress[] }) {
  return <div className="flex flex-col gap-6">
    <p>Set keepers to yHaaS relayer</p>
    <div className="flex flex-col gap-2">
    {targets.map((target, index) => <Target key={index} target={target} />)}
    </div>
  </div>
}

export default function SetKeeper() {
  const { targets } = useWhitelist()

  if (targets.length === 1) return <SingleTarget target={targets[0]} />
  return <MultipleTargets targets={targets} />
}
