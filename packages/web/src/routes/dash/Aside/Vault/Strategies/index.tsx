import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useMounted } from '../../../../../hooks/useMounted'
import { useMinimumChange } from '../../../Vault/useAllocator'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { SetMinimumChange } from '../../../Vault/tabs/Allocator/SetMinimumChange'
import String from '../../../../../strings/String'
import { useMemo } from 'react'

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
    <div className="w-full flex flex-col gap-6 p-6">
      {/* <div className="">Projected APY</div>
      <Suspense fallback={<Skeleton className="w-32 h-8 rounded" />}>
        <EstimatedApy />
      </Suspense> */}
    </div>
  )
}
