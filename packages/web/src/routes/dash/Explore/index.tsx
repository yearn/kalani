import InfiniteScroll from 'react-infinite-scroll-component'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Skeleton from '../../../components/Skeleton'
import { useFinderItems } from '../../../components/Finder/useFinderItems'
import Finder from '../../../components/Finder'
import { useBreakpoints } from '../../../hooks/useBreakpoints'
import { cn } from '../../../lib/shadcn'
import { PiCaretDown, PiCaretUp, PiMagnifyingGlass } from 'react-icons/pi'
import Hero, { HeroInset } from '../../../components/Hero'
import { ListItem } from './ListItem'
import { useFinderOptions } from '../../../components/Finder/useFinderOptions'
import { Tab, Tabs } from '../../../components/Tabs'

const FRAME_SIZE = 20

function ListItems() {
  const { filter: allItems } = useFinderItems()
  const [items, setItems] = useState(allItems?.slice(0, FRAME_SIZE))
  useEffect(() => setItems(allItems?.slice(0, FRAME_SIZE)), [allItems])
  const hasMoreFrames = useMemo(() => items.length < allItems.length, [items, allItems])
  const fetchFrame = useCallback(() => {
    const nextItems = allItems?.slice(items.length, items.length + FRAME_SIZE)
    setItems(prevItems => [...prevItems, ...nextItems])
  }, [allItems, items])

  return <InfiniteScroll className={`
    p-3 flex flex-col gap-3
    !overflow-hidden`}
		dataLength={items.length}
		next={fetchFrame}
		hasMore={hasMoreFrames}
		loader={<></>}>
    {items?.map((item) => <ListItem key={`/${item.chainId}/${item.address}`} item={item} />)}
  </InfiniteScroll>
}

function SkeletonListItems() {
  return <div className={`
    w-full p-2 sm:px-4 sm:py-8 
    flex flex-col sm:gap-8`}>
    {Array.from({ length: FRAME_SIZE }).map((_, index) => <Skeleton key={index} className="w-full h-48" />)}
  </div>
}

function ListLayout() {
  return <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
    <Suspense fallback={<SkeletonListItems />}>
      <ListItems />
    </Suspense>
  </div>
}

export default function Explore() {
  const { sm } = useBreakpoints()
  const { sortKey, sortDirection, setSortKey } = useFinderOptions()

  return <section className="flex flex-col gap-0">
    <Hero>
      <div className="w-full flex items-center gap-6 drop-shadow-lg">
        <PiMagnifyingGlass size={64} />
        <div className="flex flex-col gap-0">
          <div className="flex items-end gap-1">
            <div className="text-5xl font-fancy">E</div>
            <div className="text-4xl font-fancy">xplore</div>
          </div>
        </div>
      </div>

      <HeroInset>
        <Tabs className="mb-3 w-full xl:pr-16 justify-end">
          <Tab selected={sortKey === 'tvl'} onClick={() => setSortKey('tvl')} className="pl-3">
            {sortDirection === 'desc' ? <PiCaretDown size={16} className={sortKey === 'tvl' ? 'text-neutral-400' : 'text-transparent'} /> : <PiCaretUp size={16} className={sortKey === 'tvl' ? 'text-neutral-400' : 'text-transparent'} />}
            <div>TVL</div>
          </Tab>
          <Tab selected={sortKey === 'apy'} onClick={() => setSortKey('apy')} className="pl-3">
            {sortDirection === 'desc' ? <PiCaretDown size={16} className={sortKey === 'apy' ? 'text-neutral-400' : 'text-transparent'} /> : <PiCaretUp size={16} className={sortKey === 'apy' ? 'text-neutral-400' : 'text-transparent'} />}
            <div>APY</div>
          </Tab>
        </Tabs>
      </HeroInset>
    </Hero>

    <Finder
      className="sm:hidden !w-full pointer-events-auto"
      inputClassName={cn('px-4 py-2 border-transparent', !sm && '!rounded-none')}
      placeholder={`${sm ? 'vault / token / 0x' : 'search by vault / token / 0x'}`}
      disableSuggestions={true}
      disabled={sm} />

    <ListLayout />

  </section>
}
