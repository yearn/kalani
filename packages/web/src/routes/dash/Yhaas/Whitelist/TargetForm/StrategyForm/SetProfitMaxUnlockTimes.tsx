import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../../../../../components/elements/Input'
import Button from '../../../../../../components/elements/Button'
import { PiCheck, PiLink } from 'react-icons/pi'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContract } from '../../../../../../hooks/useWriteContract'
import { useProfitMaxUnlockTimes } from './useProfitMaxUnlockTimes'
import { cn } from '../../../../../../lib/shadcn'
import abis from '../../../../../../lib/abis'
import { useWhitelist } from '../../provider'
import { fEvmAddress } from '../../../../../../lib/format'
import { isNothing } from '@kalani/lib/strings'
import { EvmAddress } from '@kalani/lib/types'

function DaysInput({
  disabled, days, onChange, className
}: {
  disabled?: boolean,
  days?: number | string | undefined,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string
}) {
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  return <div className="relative">
    <Input
      disabled={disabled}
      value={days ?? ''} 
      type="number"
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={className}
      />
    <div className={cn(`
      absolute inset-0 pr-20
      flex items-center justify-end
      text-neutral-600 text-2xl
      pointer-events-none`)}>
      days
    </div>
  </div>
}

function SecondsInput({
  disabled, 
  seconds, 
  onChange, 
  className
}: {
  disabled?: boolean,
  seconds?: number | string | undefined,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string
}) {
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  return <div className="relative">
    <Input
      disabled={disabled}
      value={seconds ?? ''} 
      type="number"
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={className}
      />
    <div className={cn(`
      absolute inset-0 pr-20
      flex items-center justify-end
      text-neutral-600 text-2xl
      pointer-events-none`)}>
      seconds
    </div>
  </div>
}

function useWrite(
  address: EvmAddress,
  profitMaxUnlockTime: number,
  enabled: boolean
) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.strategy, address,
    functionName: 'setProfitMaxUnlockTime',
    args: [BigInt(profitMaxUnlockTime)],
    query: { enabled }
  }), [profitMaxUnlockTime, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function ExecButton({ target, profitMaxUnlockTime }: { target: EvmAddress, profitMaxUnlockTime: number }) {
  const { profitMaxUnlockTimes: _previous, refetch: refetchPrevious } = useProfitMaxUnlockTimes({ strategy: target })
  const previous = useMemo(() => _previous[0] ?? 0, [_previous])
  const isSet = useMemo(() => profitMaxUnlockTime === previous, [profitMaxUnlockTime, previous])

  const { simulation, write, confirmation, resolveToast } = useWrite(target, profitMaxUnlockTime, true)

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
      refetchPrevious()
    }
  }, [confirmation, resolveToast, refetchPrevious])

  if (isSet) return <div className="h-[42px] py-3 flex items-center justify-center text-green-400 text-sm"><PiCheck /></div>

  return <Button theme={buttonTheme} disabled={disableButton} onClick={onClick}>exec</Button>
}

function Target({ target, profitMaxUnlockTime }: { target: EvmAddress, profitMaxUnlockTime: number }) {
  return <div className="px-6 flex items-center justify-end ">
    <div className="grow">
      <span className="text-neutral-400">Strategy</span>
      <span className="text-neutral-600">(</span>
      {fEvmAddress(target)}
      <span className="text-neutral-600">)</span>.
      <span className="font-bold text-secondary-400">setProfitMaxUnlockTime</span>
      <span className="text-neutral-600">(</span>
      {profitMaxUnlockTime}
      <span className="text-neutral-600">)</span>
    </div>
    <Suspense fallback={<></>}>
      <ExecButton target={target} profitMaxUnlockTime={profitMaxUnlockTime} />
    </Suspense>
  </div>
}

export default function SetProfitMaxUnlockTimes() {
  const { targets } = useWhitelist()
  const { profitMaxUnlockTimes } = useProfitMaxUnlockTimes({})

  const maxFrequency = useMemo(() => {
    if (profitMaxUnlockTimes.length === 0) return 3
    const maxUnlock = Math.max(...profitMaxUnlockTimes.map(time => time ?? 0))
    return maxUnlock / (24 * 60 * 60)
  }, [profitMaxUnlockTimes])

  const [frequency, setFrequency] = useState<number | undefined>(maxFrequency)
  const [profitMaxUnlockTime, setProfitMaxUnlockTime] = useState<number | undefined>()

  useEffect(() => {
    if (frequency === undefined) {
      setProfitMaxUnlockTime(undefined)
    } else {
      setProfitMaxUnlockTime(frequency * 24 * 60 * 60)
    }
  }, [frequency, setProfitMaxUnlockTime])

  const onChangeFrequency = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isNothing(e.target.value)) return setFrequency(undefined)
    setFrequency(Math.max(Number(e.target.value), 0))
  }, [setFrequency])

  return <div className="flex flex-col gap-6">
    <p className="text-xl">· Set automation frequency and profit max unlock time</p>
    <div className="mt-8 px-6 flex items-center justify-end gap-6">

      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center justify-end">Automation frequency</div>
        <DaysInput days={frequency} onChange={onChangeFrequency} />
        <div className="flex items-center justify-end">Profit max unlock time</div>
        <SecondsInput disabled={true} seconds={profitMaxUnlockTime} />
      </div>

      <div className="px-6 flex flex-col gap-3 items-center justify-center text-neutral-600 text-lg">
        <div className="w-[1px] h-6 bg-neutral-800"></div>
        <PiLink />
        <div className="w-[1px] h-6 bg-neutral-800"></div>
      </div>
    </div>

    {(profitMaxUnlockTime !== undefined) && <div className="mt-8 flex flex-col gap-2">
      {targets.map((target, index) => <Target key={index} target={target} profitMaxUnlockTime={profitMaxUnlockTime} />)}
    </div>}    
  </div>
}
