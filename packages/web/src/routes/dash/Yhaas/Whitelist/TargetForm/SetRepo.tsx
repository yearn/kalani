import Input from '../../../../../components/elements/Input'
import { useWhitelist } from '../useWhitelist'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { PiCheckFatFill, PiWarningCircleBold } from 'react-icons/pi'
import { isNothing } from '@kalani/lib/strings'
import StepLabel from '../../../../../components/forms/StepLabel'
import { useMemo } from 'react'

export default function SetRepo({ step }: { step: number }) {
  const w = useWhitelist()
  const validSoFar = useMemo(() => {
    if (!w.repo) return true
    const input = w.repo.trim().toLowerCase()
    const validPrefixes = ['https://github.com/', 'github.com/']

    const matchingPrefix = validPrefixes.find(prefix => input.startsWith(prefix))
    if (matchingPrefix) {
      const path = input.slice(matchingPrefix.length)
      return path.length >= 0
    }

    return validPrefixes.some(prefix => prefix.startsWith(input))
  }, [w])

  return <div className="flex gap-12">
    <StepLabel step={step} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Set your github repo</p>
      <div className="w-full flex items-center gap-4">
        <div className="grow">
          <Input placeholder="https://github.com/user/repo" onChange={(e) => w.setRepo(e.target.value)} />
        </div>
        <div className="relative w-field-btn">
          {!isNothing(w.repo) && w.isRepoValid && <div className="absolute inset-0 flex items-center justify-center text-green-400 text-2xl">
            <FlyInFromBottom _key="set-frequency-checked">
              <PiCheckFatFill />
            </FlyInFromBottom>
          </div>}

          {!isNothing(w.repo) && !validSoFar && <div className="absolute inset-0 flex items-center justify-center text-green-400 text-2xl">
            <FlyInFromBottom _key="set-frequency-checked">
              <PiWarningCircleBold />
            </FlyInFromBottom>
          </div>}
        </div>
      </div>
    </div>
  </div>
}
