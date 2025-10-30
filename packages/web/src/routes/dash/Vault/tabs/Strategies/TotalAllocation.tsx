import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { useInputBpsSettings } from '../../../../../components/elements/InputBps'
import { useTotalDebtRatioUpdates } from '../Allocator/useTotalDebtRatioUpdates'
import { fBps } from '@kalani/lib/format'

export default function TotalAllocation() {
  const authorized = useHasRolesOnChain(ROLES.DEBT_MANAGER)
  const { setting: bpsSetting } = useInputBpsSettings()
  const { totalDebtRatio, isDirty } = useTotalDebtRatioUpdates()
  const { next } = useInputBpsSettings()
  return <div onClick={authorized ? next : undefined}
    className={`text-3xl font-bold font-mono ${(authorized && isDirty) ? 'text-primary-400' : ''}`}>
    {fBps(Number(totalDebtRatio), { percent: bpsSetting === '%' })}
  </div>
}
