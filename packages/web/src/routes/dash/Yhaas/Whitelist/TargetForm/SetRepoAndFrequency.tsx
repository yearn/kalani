import { useCallback } from 'react'
import Input from '../../../../../components/elements/Input'
import { useWhitelist } from '../provider'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { PiCheckFatFill } from 'react-icons/pi'
import { isNothing } from '@kalani/lib/strings'
import { useTargetInfos } from '../useTargetInfos'

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
  </div>
}

export default function SetRepoAndFrequency() {
  const w = useWhitelist()
  const { targetInfos } = useTargetInfos(w.targets)

  return <div className="flex flex-col gap-16">
    <div className="flex flex-col gap-6">
      <p>Set the automation frequency (days)</p>
      <div className="flex items-center gap-4">
        <div className="grow">
          <DaysInput days={w.frequency} onChange={(e) => w.setFrequency(parseInt(e.target.value))} />
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
    <p>Set your {targetInfos[0].targetType ?? 'target'}'s github repo</p>
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
