import Allocation from './Allocation'
import { AddStrategyButton } from './NoStrategies'
import { useDefaultQueueComposite } from './useDefaultQueueComposite'
import Section from '../../../../../components/Section'
import AllocationsPie from './AllocationsPie'
import { useMounted } from '../../../../../hooks/useMounted'
import EstimatedApy from '../Strategies/EstimatedApy'
import TotalAllocation from '../Strategies/TotalAllocation'
import { useTargetDebtPieData, useRealDebtPieData } from '../Strategies/useAllocationsPieData'

export default function Allocations() {
  const mounted = useMounted()
  const { defaultQueue } = useDefaultQueueComposite()
  const targetDebtPieData = useTargetDebtPieData()
  const realDebtPieData = useRealDebtPieData()

  return <div className="w-full flex flex-col gap-primary">

    <div className="sticky top-[68px] sm:top-[78px] z-10 sm:-mx-4 sm:px-32 bg-grill-950 border-b-primary border-b-black">
      <div className="py-3 sm:py-4 pr-6 w-full flex items-center gap-6 sm:gap-24">
        <div className="grow flex flex-col items-end gap-2">
          <div className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">Estimated APY</div>
          <EstimatedApy />
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">Target allocation</div>
          <TotalAllocation />
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <AllocationsPie data={targetDebtPieData} size={100} animate={!mounted} />
            <div className="text-xs text-neutral-400 whitespace-nowrap">Target</div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AllocationsPie data={realDebtPieData} size={100} animate={!mounted} />
            <div className="text-xs text-neutral-400 whitespace-nowrap">Effective</div>
          </div>
        </div>
      </div>
    </div>

    {defaultQueue.map((strategy, index) => <Section key={strategy.address} className={`${index === 0 ? 'border-t-transparent' : ''}`}>
      <Allocation strategy={strategy} />
    </Section>)}

    <Section className="sm:hidden w-full flex justify-center">
      <AddStrategyButton />
    </Section>
  </div>
}
