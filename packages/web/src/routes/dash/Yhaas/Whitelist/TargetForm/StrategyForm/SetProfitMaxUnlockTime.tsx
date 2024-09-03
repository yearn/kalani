import { useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../../../../../components/elements/Input'
import Button from '../../../../../../components/elements/Button'
import { PiCheckFatFill } from 'react-icons/pi'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContract } from '../../../../../../hooks/useWriteContract'
import { useProfitMaxUnlockTime } from './useProfitMaxUnlockTime'
import { cn } from '../../../../../../lib/shadcn'
import abis from '../../../../../../lib/abis'
import { useIsManagement } from './useIsManagement'
import FlyInFromBottom from '../../../../../../components/motion/FlyInFromBottom'
import { useWhitelist } from '../../provider'

function useWrite(
  next: bigint,
  enabled: boolean
) {
  const { targetOrUndefined: target } = useWhitelist()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.strategy,
    address: target,
    functionName: 'setProfitMaxUnlockTime',
    args: [next],
    query: { enabled }
  }), [next, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function SecondsInput({
  disabled, seconds, onChange, className
}: {
  disabled: boolean,
  seconds: number | string | undefined,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string
}) {
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  const days = useMemo(() => {
    if (seconds === undefined) return undefined
    if (typeof seconds === 'string') return parseInt(seconds) / 86400
    return seconds / 86400
  }, [seconds])

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
      pointer-events-none`, 
      (days === undefined || isNaN(days)) ? 'invisible' : '')}>
      {days?.toFixed(2)} days
    </div>
  </div>
}

export default function SetProfitMaxUnlockTime() {
  const { data: permitted } = useIsManagement()

  const { 
    data: _profitMaxUnlockTime, 
    isWithinGuidelines, 
    refetch: refetchProfitMaxUnlockTime 
  } = useProfitMaxUnlockTime()

  const profitMaxUnlockTime = useMemo(() => {
    if (_profitMaxUnlockTime === undefined) return undefined
    return Number(_profitMaxUnlockTime)
  }, [_profitMaxUnlockTime])

  const [next, setNext] = useState<number | undefined>(undefined)
  const isNextValid = useMemo(() => {
    if (next === undefined) return false
    return next > 0 && next !== profitMaxUnlockTime
  }, [next, profitMaxUnlockTime])

  const { simulation, write, confirmation, resolveToast } = useWrite(BigInt(next ?? 0), isNextValid)

  const dirty = useMemo(() => next !== profitMaxUnlockTime, [profitMaxUnlockTime, next])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => 
    !permitted
    || !isNextValid 
    || (next === undefined && !dirty)
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [permitted, isNextValid, dirty, simulation, write, confirmation])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isWithinGuidelines) return
    setNext(parseInt(e.target.value))
  }, [isWithinGuidelines, setNext])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) { 
      refetchProfitMaxUnlockTime()
      resolveToast()
    }
  }, [confirmation, resolveToast])

  return <div className="flex flex-col gap-6">
    <p>Set profit max unlock time in seconds</p>
    <div className="flex items-center gap-4">
      <div className="grow" >
        <SecondsInput disabled={!permitted} seconds={(next ?? Number(profitMaxUnlockTime))} onChange={onChange} />
      </div>

      <div className="relative isolate">
        <div className={isWithinGuidelines ? 'invisible' : ''}>
          <Button onClick={onClick} theme={buttonTheme} disabled={disabled} className="w-field-btn h-field-btn">Set</Button>
        </div>
        {isWithinGuidelines && <div className="absolute inset-0 flex items-center justify-center text-green-400 text-2xl">
          <FlyInFromBottom _key="set-profitmaxunlocktime-checked">
            <PiCheckFatFill />
          </FlyInFromBottom>
        </div>}
      </div>
    </div>
  </div>
}
