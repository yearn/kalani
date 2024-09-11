import { Suspense } from 'react'
import FlyInFromBottom from '../../../../../../components/motion/FlyInFromBottom'
import SetKeepers from './SetKeepers'
import SetProfitMaxUnlockTimes from './SetProfitMaxUnlockTimes'
import { useIsRelayed } from './useIsRelayed'
import { useProfitMaxUnlockTimes } from './useProfitMaxUnlockTimes'
import SetRepoAndFrequency from '../SetRepoAndFrequency'

export default function StrategyForm() {
  const { data: isRelayed } = useIsRelayed({})
  const { isWithinGuidelines } = useProfitMaxUnlockTimes({})

  return <div className="flex flex-col gap-20">
    <FlyInFromBottom _key="target-form-keeper">
      <SetKeepers />
    </FlyInFromBottom>

    {isRelayed && <FlyInFromBottom _key="target-form-profit-unlock">
      <Suspense>
        <SetProfitMaxUnlockTimes />
      </Suspense>
    </FlyInFromBottom>}

    {isRelayed && isWithinGuidelines && <FlyInFromBottom _key="target-form-repo">
      <Suspense>
        <SetRepoAndFrequency />
      </Suspense>
    </FlyInFromBottom>}
  </div>
}
