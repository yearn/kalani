import { useCallback, useMemo } from 'react'
import Input from '../../../../../components/elements/Input'
import { cn } from '../../../../../lib/shadcn'
import { useWhitelist } from '../provider'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { PiCheckFatFill } from 'react-icons/pi'
import { isNothing } from '../../../../../lib/strings'
import { useTargetType } from '../useTargetType'

function SecondsInput({
  disabled, seconds, onChange, className
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

export default function SetRepoAndFrequency() {
  const w = useWhitelist()
  const { data: targetType } = useTargetType(w.targetOrUndefined)

  return <div className="flex flex-col gap-16">
    <div className="flex flex-col gap-6">
      <p>Set the automation frequency</p>
      <div className="flex items-center gap-4">
        <div className="grow">
          <SecondsInput seconds={w.frequency} onChange={(e) => w.setFrequency(parseInt(e.target.value))} />
        </div>
        <div className="relative w-field-btn">
          {((w.frequency ?? 0) > 0) && <div className="absolute inset-0 flex items-center justify-center text-green-400 text-2xl">
            <FlyInFromBottom _key="set-frequency-checked">
              <PiCheckFatFill />
            </FlyInFromBottom>
          </div>}
        </div>
      </div>
    </div>
    <div className="flex flex-col gap-6">
    <p>Set your {targetType}'s github repo</p>
      <div className="w-full flex items-center gap-4">
        <div className="grow">
          <Input placeholder='Github repo url' onChange={(e) => w.setRepo(e.target.value)} />
        </div>
        <div className="relative w-field-btn">
          {!isNothing(w.repo) && <div className="absolute inset-0 flex items-center justify-center text-green-400 text-2xl">
            <FlyInFromBottom _key="set-frequency-checked">
              <PiCheckFatFill />
            </FlyInFromBottom>
          </div>}
        </div>
      </div>
    </div>
  </div>
}
