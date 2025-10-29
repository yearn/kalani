import { Suspense, useMemo, useState, useEffect } from 'react'
import { useDefaultQueueComposite } from '../Allocator/useDefaultQueueComposite'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useFinderItems } from '../../../../../components/Finder/useFinderItems'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { fPercent } from '@kalani/lib/format'
import { PiDotsSixVertical, PiCaretDownBold } from 'react-icons/pi'
import { Reorder, motion, useDragControls } from 'framer-motion'
import { springs } from '../../../../../lib/motion'
import StrategyDetail from './StrategyDetail'
import { StrategyDetailProvider } from './StrategyDetailProvider'
import Skeleton from '../../../../../components/Skeleton'
import { SetDefaultQueue } from './SetDefaultQueue'
import Info from '../../../../../components/Info'
import { AddStrategy } from './AddStrategy'
import { useOnChainTargetRatios } from '../Allocator/useOnChainTargetRatios'
import { AllocatorPanel } from './AllocatorPanel'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import bmath from '@kalani/lib/bmath'

function StrategyTableHeader() {
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-8 mb-12">
      <div className="w-6"></div>
      <h2 className="font-bold text-neutral-400 flex items-center gap-2">
        Strategy queue
        <Info _key="strategy-queue" size={16} />
      </h2>
      <h2 className="font-semibold text-neutral-400 text-right flex items-center justify-end">APY</h2>
      <h2 className="font-semibold text-neutral-400 text-right flex items-center justify-end">Debt ratio</h2>
      <div className="w-6"></div>
    </div>
  )
}

function Suspender() {
  const authorized = useHasRolesOnChain(ROLES.QUEUE_MANAGER)
  const { defaultQueue } = useDefaultQueueComposite()
  const { vault } = useVaultFromParams()
  const { items } = useFinderItems()
  const { onChainTargetRatios } = useOnChainTargetRatios()

  const strategies = useMemo(() => {
    return defaultQueue.map((strategy) => {
      // Find the target ratio for this strategy (returns bigint in basis points)
      const targetRatioBps = onChainTargetRatios.find(a =>
        compareEvmAddresses(a.strategy, strategy.address)
      )?.debtRatio ?? 0n

      // Convert from basis points (0-10000) to decimal (0-1)
      const targetDebtRatio = Number(bmath.div(targetRatioBps, 10_000n))

      const item = items.find(a => compareEvmAddresses(a.address, strategy.address))
      const apy = item?.apy ?? 0

      return {
        ...strategy,
        targetDebtRatio,
        apy
      }
    })
  }, [defaultQueue, onChainTargetRatios, items])

  const [orderedAddresses, setOrderedAddresses] = useState(() => strategies.map(s => s.address))
  const [expandedStrategies, setExpandedStrategies] = useState<Set<string>>(new Set())

  // Derive ordered strategies from the order array and latest strategies data
  const orderedStrategies = useMemo(() => {
    return orderedAddresses
      .map(address => strategies.find(s => compareEvmAddresses(s.address, address)))
      .filter(Boolean)
  }, [orderedAddresses, strategies])

  useEffect(() => {
    const currentAddresses = new Set(orderedAddresses)
    const newAddresses = new Set(strategies.map(s => s.address))

    const hasChanged = currentAddresses.size !== newAddresses.size ||
      [...newAddresses].some(addr => !currentAddresses.has(addr))

    if (hasChanged) {
      setOrderedAddresses(strategies.map(s => s.address))
    }

  }, [strategies, orderedAddresses])

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
    <>
      <div className="w-full px-12">
        <StrategyTableHeader />
        <Reorder.Group axis="y" values={orderedAddresses} onReorder={setOrderedAddresses} className="space-y-8">
          {orderedStrategies.map((strategy, index) => {
            const isOpen = expandedStrategies.has(strategy.address)
            return <StrategyItem key={strategy.address} strategy={strategy} index={index} isOpen={isOpen} toggleExpand={toggleExpand} authorized={authorized} />
          })}
        </Reorder.Group>
        {authorized && <>
          <div className="mt-8">
            <AddStrategy />
          </div>
          <div className="flex items-center justify-end mt-12 mb-2">
            <SetDefaultQueue orderedStrategies={orderedStrategies} />
          </div>
        </>}
      </div>

      <AllocatorPanel />
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function StrategyItem({ strategy, index, isOpen, toggleExpand, authorized }: { strategy: any, index: number, isOpen: boolean, toggleExpand: (address: string) => void, authorized: boolean }) {
  const dragControls = useDragControls()

  return (
    <Reorder.Item
      key={strategy.address}
      value={strategy.address}
      className="flex flex-col"
      layout="position"
      transition={{ type: 'spring', stiffness: 4200, damping: 128 }}
      dragTransition={{ bounceStiffness: springs.roll.stiffness, bounceDamping: springs.roll.damping }}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className="group grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-8 select-none" data-zerodebt={strategy.targetDebtRatio === 0}>
        <button
          data-open={isOpen}
          className="!px-0 flex items-center justify-center group-data-[zerodebt=true]:text-neutral-400"
          onClick={() => toggleExpand(strategy.address)}
        >
          <PiCaretDownBold className="data-[open=true]:rotate-180 text-2xl group-data-[zerodebt=true]:text-neutral-400" />
        </button>
        <div className="flex items-center text-xl group-data-[zerodebt=true]:text-neutral-400">#{index} {strategy.name}</div>
        <div className="text-right text-2xl group-data-[zerodebt=true]:text-neutral-400">{fPercent(strategy.apy)}</div>
        <div className="text-right text-2xl group-data-[zerodebt=true]:text-neutral-400">{fPercent(strategy.targetDebtRatio, { padding: { length: 2, fill: '0' } })}</div>
        {authorized ? (
          <div
            className="flex items-center justify-center text-right cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => dragControls.start(e)}
          >
            <PiDotsSixVertical className="text-2xl group-data-[zerodebt=true]:text-neutral-400" />
          </div>
        ) : (
          <div className="w-6"></div>
        )}
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

export default function Strategies() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <Suspender />
    </Suspense>
  )
}
