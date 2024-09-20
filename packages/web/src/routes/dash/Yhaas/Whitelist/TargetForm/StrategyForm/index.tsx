import { Suspense } from 'react'
import FlyInFromBottom from '../../../../../../components/motion/FlyInFromBottom'
import SetKeepers from './SetKeepers'
import SetProfitMaxUnlockTimes from '../SetProfitMaxUnlockTimes'
import { useIsRelayed } from './useIsRelayed'
import { useProfitMaxUnlockTimes } from '../useProfitMaxUnlockTimes'
import SetRepo from '../SetRepo'

export default function StrategyForm() {
  const { data: areRelayed } = useIsRelayed()
  const { areWithinGuidelines } = useProfitMaxUnlockTimes()

  return <div className="flex flex-col gap-20">
    <FlyInFromBottom _key="target-form-keeper">
      <SetKeepers />
    </FlyInFromBottom>

    {areRelayed && <FlyInFromBottom _key="target-form-profit-unlock">
      <Suspense>
        <SetProfitMaxUnlockTimes />
      </Suspense>
    </FlyInFromBottom>}

    {areRelayed && areWithinGuidelines && <FlyInFromBottom _key="target-form-repo">
      <Suspense>
        <SetRepo step={4} />
      </Suspense>
    </FlyInFromBottom>}
  </div>
}
