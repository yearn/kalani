import Header from '../Header'
import Drawer from '../Drawer'
import { ExplorerItem, useExplorerItems } from './useExplorerItems'
import ChainImage from '../../../components/ChainImage'
import { Suspense, useEffect, useMemo } from 'react'
import { fEvmAddress, fPercent, fUSD } from '@kalani/lib/format'
import A from '../../../components/elements/A'
import Skeleton from '../../../components/Skeleton'

function Minibars({ series, className }: { series: number[], className?: string }) {
	const maxBar = 100
	const maxSeries = Math.max(...series)
	const scale = maxBar / maxSeries
	const bars = series.map(value => Math.round(scale * value) || 1)
  useEffect(() => {
    console.log(bars)
  }, [bars])
	return <div className={`flex items-end gap-2 ${className}`}>
		{bars.map((bar, index) => <div key={index} className={`
			w-full h-[${bar}%] bg-neutral-800 
      ${index === 0 ? 'rounded-bl-primary' : ''}
      ${index === bars.length - 1 ? 'rounded-br-primary' : ''}
    `} />)}
	</div>
}

function Label({ item }: { item: ExplorerItem }) {
  const label = useMemo(() => {
    switch (item.label) {
      case 'vault': return 'yearn multi-strategy'
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

function Tile({ item }: { item: ExplorerItem }) {
  const href = useMemo(() => {
    return `/${item.label}/${item.chainId}/${item.address}`
  }, [item])

  return <a href={href} className={`group relative p-3 flex flex-col
    gap-2 border-2 border-transparent hover:border-secondary-200 
    saber-glow bg-black rounded-primary cursor-pointer`}>
    <div className="flex flex-col gap-2">
      <Minibars series={item.sparklines?.tvl ?? []} className="w-full h-[200px]" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end gap-2">

        <div className="flex items-center gap-3">
          <ChainImage chainId={item.chainId} size={28} />
          <Label item={item} />
          <div className="p-2 bg-neutral-900 text-xs text-neutral-400 rounded-full">{fEvmAddress(item.address)}</div>
        </div>

        <div className="max-w-full truncate font-fancy text-lg">{item.name}</div>

        <div className="flex justify-between">
          <div className="text-2xl font-bold">
            TVL {fUSD(item.tvl ?? 0)}
          </div>
          <div className="text-2xl font-bold">
            APY {fPercent(item.apy ?? 0)}
          </div>
        </div>

      </div>
    </div>
  </a>
}

function SkeletonTiles() {
  const count = 12
  return <div className={`w-full p-2 sm:p-4
    grid grid-flow-row gap-2 grid-cols-1 
    sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`}>
    {Array.from({ length: count }).map((_, index) => <Skeleton key={index} className="w-full h-48 rounded-primary" />)}
  </div>
}

function Tiles() {
  const { data: items } = useExplorerItems()
  return <div className={`w-full p-2 sm:p-4 
    grid grid-flow-row gap-2 grid-cols-1 
    sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4`}>
    {items?.map((item, index) => <Tile key={index} item={item} />)}
  </div>
}

export default function Explore() {
  return <div className="w-full min-h-screen">
    <Header className="sticky z-50 inset-x-0 top-0 w-full" />
    <Drawer className="fixed z-50 top-0 left-0 w-24 h-screen" />
    <div className="flex items-start">
      <div className="min-w-24 border"></div>
      <div className="isolate grow flex justify-center px-3 py-6 border-r border-r-primary-1000">
        <Suspense fallback={<SkeletonTiles />}>
          <Tiles />
        </Suspense>
      </div>
    </div>
  </div>
}
