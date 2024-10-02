import Header from '../Header'
import Drawer from '../Drawer'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChainImg from '../../../components/ChainImg'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { fEvmAddress, fPercent, fUSD } from '@kalani/lib/format'
import Skeleton from '../../../components/Skeleton'
import TokenImg from '../../../components/TokenImg'
import { FinderItem, useFinderItems } from '../../../components/Finder/useFinderItems'
import MenuBar from '../../../components/MenuBar'
import Finder from '../../../components/Finder'
import { useBreakpoints } from '../../../hooks/useBreakpoints'
import { cn } from '../../../lib/shadcn'

const FRAME_SIZE = 20

function Minibars({ series, className }: { series: number[], className?: string }) {
	const maxBar = 100
	const maxSeries = Math.max(...series)
	const scale = maxBar / maxSeries
	const bars = series.map(value => Math.round(scale * value) || 1)
	return <div className={`flex items-end gap-2 ${className}`}>
		{bars.map((bar, index) => <div key={index} className={`
			w-full h-[${bar}%] bg-neutral-800 
      ${index === 0 ? 'rounded-bl-primary' : ''}
      ${index === bars.length - 1 ? 'rounded-br-primary' : ''}
    `} />)}
	</div>
}

function Label({ item }: { item: FinderItem }) {
  const label = useMemo(() => {
    switch (item.label) {
      case 'vault': return 'yearn allocator'
      case 'strategy': return 'yearn strategy'
      default: return item.label
    }
  }, [item])

  const bgClassName = useMemo(() => {
    switch (item.label) {
      case 'vault': return 'bg-blue-900'
      case 'strategy': return 'bg-blue-900'
      default: return 'bg-neutral-900'
    }
  }, [item])

  const textClassName = useMemo(() => {
    switch (item.label) {
      case 'vault': return 'text-neutral-100'
      case 'strategy': return 'text-neutral-100'
      default: return 'text-neutral-400'
    }
  }, [item])

  return <div className={`p-2 text-xs rounded-full ${bgClassName} ${textClassName}`}>
    {label}
  </div>
}

function Tile({ item }: { item: FinderItem }) {
  const href = useMemo(() => {
    return `/${item.label}/${item.chainId}/${item.address}`
  }, [item])

  return <a href={href} className={`group relative p-3 flex flex-col
    gap-2 border-primary border-transparent hover:border-secondary-200 
    saber-glow bg-black rounded-primary cursor-pointer`}>
    <div className="flex flex-col gap-2">
      <Minibars series={item.sparklines?.tvl ?? []} className="w-full h-[200px]" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end gap-2">

        <div className="max-w-full truncate font-fancy text-xl">{item.name}</div>

        <div className="flex justify-between">
          <div className="text-2xl font-bold">
            TVL {fUSD(item.tvl ?? 0)}
          </div>
          <div className="text-2xl font-bold">
            APY {fPercent(item.apy ?? 0)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ChainImg chainId={item.chainId} size={28} />
          <TokenImg chainId={item.chainId} address={item.token?.address} size={28} />
          <Label item={item} />
          <div className="p-2 bg-neutral-900 text-xs text-neutral-400 rounded-full">{fEvmAddress(item.address)}</div>
        </div>
      </div>
    </div>
  </a>
}

function Tiles() {
  const { filter: allItems } = useFinderItems()
  const [items, setItems] = useState(allItems?.slice(0, FRAME_SIZE))
  useEffect(() => setItems(allItems?.slice(0, FRAME_SIZE)), [allItems])
  const hasMoreFrames = useMemo(() => items.length < allItems.length, [items, allItems])
  const fetchFrame = useCallback(() => {
    const nextItems = allItems?.slice(items.length, items.length + FRAME_SIZE)
    setItems(prevItems => [...prevItems, ...nextItems])
  }, [allItems, items])

  return <InfiniteScroll className={`w-full p-2 sm:px-4 sm:py-8 
    grid grid-flow-row gap-2 grid-cols-1 
    sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4
    !overflow-hidden`}
		dataLength={items.length}
		next={fetchFrame}
		hasMore={hasMoreFrames}
		loader={<></>}>
    {items?.map((item, index) => <Tile key={index} item={item} />)}
  </InfiniteScroll>
}

function SkeletonTiles() {
  return <div className={`w-full p-2 sm:p-4
    grid grid-flow-row gap-2 grid-cols-1 
    sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`}>
    {Array.from({ length: FRAME_SIZE }).map((_, index) => <Skeleton key={index} className="w-full h-48 rounded-primary" />)}
  </div>
}

export default function Explore() {
  const { sm } = useBreakpoints()
  return <div className="w-full min-h-screen">
    <Header disableFinderSuggestions={true} className="hidden sm:block fixed z-50 inset-x-0 top-0 w-full" />
    <Drawer className="hidden sm:flex fixed z-50 top-0 left-0 w-24 h-screen" />
    <div className="pt-0 sm:pt-10 flex items-start">
      <div className="hidden sm:block min-w-24 border"></div>
      <div className="isolate grow px-3 py-6 border-r border-r-primary-1000">
        <Suspense fallback={<SkeletonTiles />}>
          <Tiles />
        </Suspense>
      </div>
    </div>
    <MenuBar className="sm:hidden" />
    <div className="sm:hidden fixed inset-0 flex flex-col justify-end pointer-events-none">
      <Finder 
        className="!w-full pointer-events-auto"
        inputClassName={cn('px-4 py-2 border-transparent', !sm && '!rounded-none')}
        placeholder="vault / token / 0x"
        disableSuggestions={true} />
    </div>
  </div>
}
