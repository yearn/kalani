import Input from '../../../../../components/elements/Input'
import { useWhitelist } from '../provider'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { PiCheckFatFill } from 'react-icons/pi'
import { isNothing } from '@kalani/lib/strings'
import StepLabel from '../StepLabel'

export default function SetRepo({ step }: { step: number }) {
  const w = useWhitelist()

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
        </div>
      </div>
    </div>
  </div>
}
