import { Suspense } from 'react'
import FlyInFromBottom from '../../../../../../components/motion/FlyInFromBottom'
import SetKeeper from './SetKeeper'
import SetProfitMaxUnlockTime from './SetProfitMaxUnlockTime'
import { useIsRelayed } from './useIsRelayed'
import { useProfitMaxUnlockTime } from './useProfitMaxUnlockTime'
import SetRepoAndFrequency from '../SetRepoAndFrequency'

export default function StrategyForm() {
  const { data: isRelayed } = useIsRelayed({})
  const { isWithinGuidelines } = useProfitMaxUnlockTime()

  return <div className="flex flex-col gap-16">
    <FlyInFromBottom _key="target-form-keeper">
      <SetKeeper />
    </FlyInFromBottom>

    {isRelayed && <FlyInFromBottom _key="target-form-profit-unlock">
      <Suspense>
        <SetProfitMaxUnlockTime />
      </Suspense>
    </FlyInFromBottom>}

    {isRelayed && isWithinGuidelines && <FlyInFromBottom _key="target-form-repo">
      <Suspense>
        <SetRepoAndFrequency />
      </Suspense>
    </FlyInFromBottom>}
  </div>
}
