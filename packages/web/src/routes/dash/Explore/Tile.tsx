import { FinderItem, getItemHref } from '../../../components/Finder/useFinderItems'
import { fEvmAddress, fHexString, fPercent, fUSD } from '@kalani/lib/format'
import ChainImg from '../../../components/ChainImg'
import TokenImg from '../../../components/TokenImg'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'

export function Minibars({ series, className }: { series: number[], className?: string }) {
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
    if (item.projectId) return item.projectName ?? `project ${fHexString(item.projectId, true)}`
    return item.label
  }, [item])

  const bgClassName = useMemo(() => {
    switch (item.label) {
      case 'yVault': return 'bg-secondary-900'
      case 'yStrategy': return 'bg-secondary-900'
      default: return 'bg-neutral-900'
    }
  }, [item])

  const textClassName = useMemo(() => {
    switch (item.label) {
      case 'yVault': return 'text-neutral-100'
      case 'yStrategy': return 'text-neutral-100'
      default: return 'text-neutral-400'
    }
  }, [item])

  return <div className={`p-2 text-xs rounded-full ${bgClassName} ${textClassName}`}>
    {label}
  </div>
}

export function Tile({ item }: { item: FinderItem }) {
  return <Link to={getItemHref(item)} className={`group relative p-3 flex flex-col
    gap-2 border-primary border-transparent hover:border-secondary-200 active:border-secondary-400
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
  </Link>
}
