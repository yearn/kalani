import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Input from '../../../../../components/elements/Input'
import Button from '../../../../../components/elements/Button'
import { PiCheck, PiLink } from 'react-icons/pi'
import { useAccount, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useProfitMaxUnlockTimes } from './useProfitMaxUnlockTimes'
import { cn } from '../../../../../lib/shadcn'
import abis from '@kalani/lib/abis'
import { useWhitelist } from '../useWhitelist'
import { fEvmAddress } from '@kalani/lib/format'
import { capitalize, isNothing } from '@kalani/lib/strings'
import { EvmAddress } from '@kalani/lib/types'
import { useAutomationGuidelines } from './StrategyForm/useAutomationGuidelines'
import { TargetType, useTargetInfos } from '../useTargetInfos'
import StepLabel from '../../../../../components/forms/StepLabel'

function DaysInput({
  disabled, days, onChange, className, theme, isValid, validationMessage
}: {
  disabled?: boolean,
  days?: number | string | undefined,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string,
  theme?: 'default' | 'warn' | 'error',
  isValid?: boolean,
  validationMessage?: string
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
      theme={theme}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={className}
      />
    <div className={cn(`
      absolute inset-0 pr-14
      flex items-center justify-end
      text-neutral-600 text-2xl
      pointer-events-none`)}>
      days
    </div>
    <div className={cn('absolute right-0 -bottom-6 text-error-500 text-xs whitespace-nowrap', isValid ? 'hidden' : '')}>
      {validationMessage}
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
      absolute inset-0 pr-14
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

function ExecButton({ target, profitMaxUnlockTime, disabled }: { target: EvmAddress, profitMaxUnlockTime: number, disabled: boolean }) {
  const { refetch: refetchAll } = useProfitMaxUnlockTimes()
  const { profitMaxUnlockTimes: _previous, refetch: refetchPrevious } = useProfitMaxUnlockTimes({ strategy: target })
  const previous = useMemo(() => _previous[0] ?? 0, [_previous])
  const isSet = useMemo(() => profitMaxUnlockTime === previous, [profitMaxUnlockTime, previous])

  const { simulation, write, confirmation, resolveToast } = useWrite(target, profitMaxUnlockTime, !disabled)

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disableButton = useMemo(() => 
    disabled
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [disabled, simulation, write, confirmation])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetchAll()
      refetchPrevious()
    }
  }, [confirmation, resolveToast, refetchAll, refetchPrevious])

  if (isSet && !disabled) return <div className="h-[42px] py-3 flex items-center justify-center text-green-400 text-sm"><PiCheck /></div>

  return <Button theme={buttonTheme} disabled={disableButton} onClick={onClick}>Exec</Button>
}

function Target({ target, type, profitMaxUnlockTime, isWithinGuidelines }: { target: EvmAddress, type: TargetType, profitMaxUnlockTime: number, isWithinGuidelines: boolean }) {
  return <div className="px-6 flex items-center justify-end ">
    <div className="grow">
      <span className="text-neutral-400">{capitalize(type)}</span>
      <span className="text-neutral-600">(</span>
      {fEvmAddress(target)}
      <span className="text-neutral-600">)</span>.
      <span className="font-bold text-secondary-400">setProfitMaxUnlockTime</span>
      <span className="text-neutral-600">(</span>
      {profitMaxUnlockTime}
      <span className="text-neutral-600">)</span>
    </div>
    <Suspense fallback={<></>}>
      <ExecButton target={target} profitMaxUnlockTime={profitMaxUnlockTime} disabled={!isWithinGuidelines} />
    </Suspense>
  </div>
}

export default function SetProfitMaxUnlockTimes() {
  const { chain } = useAccount()
  const { targets, frequency, setFrequency } = useWhitelist()
  const { targetInfos } = useTargetInfos(targets)
  const { profitMaxUnlockTimes } = useProfitMaxUnlockTimes()
  const { recommendedFrequency, isWithinGuidelines: _isWithinGuidelines } = useAutomationGuidelines()

  const initialFrequency = useMemo(() => {
    if (profitMaxUnlockTimes.length === 0) return recommendedFrequency
    const maxUnlock = Math.max(...profitMaxUnlockTimes.map(time => time ?? 0))
    return maxUnlock / (24 * 60 * 60)
  }, [recommendedFrequency, profitMaxUnlockTimes])

  useEffect(() => setFrequency(initialFrequency), [initialFrequency, setFrequency])

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
    const nextFrequency = Math.max(Number(e.target.value), 0)
    setFrequency(nextFrequency)
  }, [setFrequency])

  const isWithinGuidelines = useMemo(() => {
    if (frequency === undefined) return false
    return _isWithinGuidelines(frequency)
  }, [frequency, _isWithinGuidelines])

  return <div className="flex items-start gap-12">
    <StepLabel step={3} />
    <div className="flex flex-col">
      <p className="text-xl">Set automation frequency and profit max unlock time</p>

      <div className="mt-8 px-6 flex items-center justify-end gap-6">

        <div className="relative grid grid-cols-2 gap-6">
          <div className="flex items-center justify-end">Automation frequency</div>
          <DaysInput 
            days={frequency} 
            onChange={onChangeFrequency} 
            theme={isWithinGuidelines ? undefined : 'error'} 
            isValid={isWithinGuidelines}
            validationMessage={`${recommendedFrequency} days or more recommended on ${chain?.name}`}
            />

          <div className="flex items-center justify-end">Profit max unlock time</div>
          <SecondsInput disabled={true} seconds={profitMaxUnlockTime} />
        </div>

        <div className="px-6 flex flex-col gap-3 items-center justify-center text-neutral-600 text-lg">
          <div className="w-[1px] h-6 bg-neutral-800"></div>
          <PiLink />
          <div className="w-[1px] h-6 bg-neutral-800"></div>
        </div>
      </div>

      {profitMaxUnlockTime !== undefined && <div className="mt-8 flex flex-col gap-2">
        {targetInfos.map((target, index) => <Target key={index} target={target.address} type={target.targetType!} profitMaxUnlockTime={profitMaxUnlockTime} isWithinGuidelines={isWithinGuidelines} />)}
      </div>}    
    </div>
  </div>
}
