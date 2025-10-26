import { Suspense, useMemo, useState } from 'react'
import { useDefaultQueueComposite } from '../Allocator/useDefaultQueueComposite'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useFinderItems } from '../../../../../components/Finder/useFinderItems'
import { compareEvmAddresses } from '@kalani/lib/strings'
import bmath from '@kalani/lib/bmath'
import { fPercent } from '@kalani/lib/format'
import { PiDotsSixVertical, PiCaretDownBold } from 'react-icons/pi'
import { Reorder, motion, useDragControls } from 'framer-motion'
import { springs } from '../../../../../lib/motion'
import StrategyDetail from './StrategyDetail'
import { StrategyDetailProvider } from './StrategyDetailProvider'
import Skeleton from '../../../../../components/Skeleton'
import { SetDefaultQueue } from './SetDefaultQueue'
import Info from '../../../../../components/Info'

function StrategyTableHeader() {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-8 mb-12">
      <div className="w-6"></div>
      <h2 className="font-semibold text-neutral-400 flex items-center gap-2">
        Strategy queue
        <Info _key="strategy-queue" size={16} />
      </h2>
      <h2 className="font-semibold text-neutral-400 text-right flex items-center justify-end">APY</h2>
      <h2 className="font-semibold text-neutral-400 text-right flex items-center justify-end">Allocation</h2>
      <div className="w-6"></div>
    </div>
  )
}

function Suspender() {
  const { defaultQueue } = useDefaultQueueComposite()
  const { vault } = useVaultFromParams()
  const { items } = useFinderItems()

  const totalAssets = vault?.totalAssets ?? 0n

  const strategies = useMemo(() => {
    return defaultQueue.map((strategy) => {
      const currentDebt = strategy.currentDebt ?? 0n
      const allocation = totalAssets > 0n
        ? Number(bmath.div(currentDebt, totalAssets)) * 100
        : 0

      const item = items.find(a => compareEvmAddresses(a.address, strategy.address))
      const apy = item?.apy ?? 0

      return {
        ...strategy,
        allocation,
        apy
      }
    })
  }, [defaultQueue, totalAssets, items])

  const [orderedStrategies, setOrderedStrategies] = useState(() => strategies)
  const [expandedStrategies, setExpandedStrategies] = useState<Set<string>>(new Set())

  const toggleExpand = (address: string) => {
    setExpandedStrategies(prev => {
      const next = new Set(prev)
      if (next.has(address)) {
        next.delete(address)
      } else {
        next.add(address)
      }
      return next
    })
  }

  return (
    <div className="w-full px-12">
      <StrategyTableHeader />
      <Reorder.Group axis="y" values={orderedStrategies} onReorder={setOrderedStrategies} className="space-y-8">
        {orderedStrategies.map((strategy, index) => {
          const isOpen = expandedStrategies.has(strategy.address)
          return <StrategyItem key={strategy.address} strategy={strategy} index={index} isOpen={isOpen} toggleExpand={toggleExpand} />
        })}
      </Reorder.Group>
      <div className="flex items-center justify-end my-12">
        <SetDefaultQueue orderedStrategies={orderedStrategies} />
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StrategyItem({ strategy, index, isOpen, toggleExpand }: { strategy: any, index: number, isOpen: boolean, toggleExpand: (address: string) => void }) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      key={strategy.address}
      value={strategy}
      className="flex flex-col"
      layout="position"
      transition={springs.roll}
      dragTransition={{ bounceStiffness: springs.roll.stiffness, bounceDamping: springs.roll.damping }}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-8 select-none">
        <button
          data-open={isOpen}
          className="group !px-0 flex items-center justify-center"
          onClick={() => toggleExpand(strategy.address)}
        >
          <PiCaretDownBold className="group-data-[open=true]:rotate-180 text-2xl" />
        </button>
        <div className="flex items-center text-xl">#{index} {strategy.name}</div>
        <div className="text-right text-2xl">{fPercent(strategy.apy)}</div>
        <div className="text-right text-2xl">{strategy.allocation.toFixed(2)}%</div>
        <div
          className="flex items-center justify-center text-right cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <PiDotsSixVertical className="text-2xl" />
        </div>
      </div>

      <motion.div
        key={`${strategy.address}-detail-${isOpen}`}
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={springs.roll}
        className="overflow-hidden"
      >
        <StrategyDetailProvider strategy={strategy} isOpen={isOpen}>
          <StrategyDetail />
        </StrategyDetailProvider>
      </motion.div>
    </Reorder.Item>
  )
}

function LoadingSkeleton() {
  return (
    <div className="w-full px-12">
      <StrategyTableHeader />
      <div className="space-y-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-8">
            <Skeleton className="w-6 h-6 rounded" />
            <Skeleton className="h-6 rounded" />
            <Skeleton className="w-20 h-6 rounded ml-auto" />
            <Skeleton className="w-20 h-6 rounded ml-auto" />
            <Skeleton className="w-6 h-6 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Allocator2() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Suspender />
    </Suspense>
  )
}
