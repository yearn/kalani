import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useMounted } from '../../../../../hooks/useMounted'
import { useMinimumChange } from '../../../Vault/useAllocator'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { SetMinimumChange } from '../../../Vault/tabs/Allocator/SetMinimumChange'
import String from '../../../../../strings/String'
import { Suspense, useMemo } from 'react'
import Skeleton from '../../../../../components/Skeleton'
import EstimatedApy from '../../../Vault/tabs/Strategies/EstimatedApy'
import TotalAllocation from '../../../Vault/tabs/Strategies/TotalAllocation'
import AllocationsPie from '../../../Vault/tabs/Allocator/AllocationsPie'
import { useRealDebtPieData, useTargetDebtPieData } from '../../../Vault/tabs/Strategies/useAllocationsPieData'

function SetMinimumChangeNotification() {
  return <div className="p-8 flex flex-col gap-8 border-primary border-warn-950 rounded-primary text-warn-400">
    <h2 className="text-xl">Minimum Change</h2>
    <p className="flex items-center gap-8 text-warn-400">
      <String _key="new-vault-min-change" />
    </p>
    <div className="flex justify-end gap-4 text-xs 2xl:text-md">
      <SetMinimumChange className="text-neutral-400" />
    </div>
  </div>
}

export default function Strategies() {
  const { minimumChange } = useMinimumChange()
  const mounted = useMounted()
  const authorizedDebtManager = useHasRolesOnChain(ROLES.DEBT_MANAGER)
  const targetDebtPieData = useTargetDebtPieData()
  const realDebtPieData = useRealDebtPieData()

  const showMinChangeNotification = useMemo(() => {
    return (minimumChange < 1) && authorizedDebtManager
  }, [minimumChange, authorizedDebtManager])

  if (showMinChangeNotification) {
    return (
      <FlyInFromBottom _key="aside-strategies-no-min-change" parentMounted={mounted} exit={1} className="flex flex-col gap-12">
        <SetMinimumChangeNotification />
      </FlyInFromBottom>
    )
  }

  return (
    <div className="w-full flex flex-col items-center gap-12 p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-neutral-400">Projected APY</div>
          <Suspense fallback={<Skeleton className="w-32 h-8 rounded-primary" />}>
            <EstimatedApy />
          </Suspense>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="text-xs text-neutral-400">Target allocation</div>
          <Suspense fallback={<Skeleton className="w-32 h-8 rounded-primary" />}>
            <TotalAllocation />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-12">
        <Suspense fallback={<Skeleton className="w-24 h-24 rounded-full" />}>
          <div className="flex flex-col items-center gap-2">
            <AllocationsPie data={targetDebtPieData} size={180} animate={false} />
            <div className="text-xs text-neutral-400">Target Ratios</div>
          </div>
        </Suspense>

        <Suspense fallback={<Skeleton className="w-24 h-24 rounded-full" />}>
          <div className="flex flex-col items-center gap-2">
            <AllocationsPie data={realDebtPieData} size={180} animate={false} />
            <div className="text-xs text-neutral-400">Effective Ratios</div>
          </div>
        </Suspense>
      </div>
    </div>
  )
}
