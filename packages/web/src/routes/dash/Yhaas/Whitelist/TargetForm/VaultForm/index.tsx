import { Suspense } from 'react'
import FlyInFromBottom from '../../../../../../components/motion/FlyInFromBottom'
import SetRoles from './SetRoles'
import SetProfitMaxUnlockTimes from '../SetProfitMaxUnlockTimes'
import { useIsRelayed } from './useIsRelayed'
import { useProfitMaxUnlockTimes } from '../useProfitMaxUnlockTimes'
import SetRepo from '../SetRepo'
import { ROLES } from '@kalani/lib/types'
import SetAllocator from './SetAllocator'

export default function VaultForm() {
  const { data: areRelayed } = useIsRelayed({ rolemask: ROLES.REPORTING_MANAGER })
  const { areWithinGuidelines } = useProfitMaxUnlockTimes()

  return <div className="flex flex-col gap-20">
    <FlyInFromBottom _key="target-form-keeper">
      <SetRoles rolemask={ROLES.REPORTING_MANAGER} />
    </FlyInFromBottom>

    {areRelayed && <FlyInFromBottom _key="target-form-profit-unlock">
      <Suspense>
        <SetProfitMaxUnlockTimes />
      </Suspense>
    </FlyInFromBottom>}

    {areRelayed && areWithinGuidelines && <FlyInFromBottom _key="target-form-allocator">
      <Suspense>
        <SetAllocator />
      </Suspense>
    </FlyInFromBottom>}

    {areRelayed && areWithinGuidelines && <FlyInFromBottom _key="target-form-repo">
      <Suspense>
        <SetRepo step={5} />
      </Suspense>
    </FlyInFromBottom>}
  </div>
}
