import { FinderItem, getItemHref } from '../../../components/Finder/useFinderItems'
import { fEvmAddress, fHexString, fPercent, fUSD } from '@kalani/lib/format'
import { AutoTextSize } from 'auto-text-size'
import ChainImg from '../../../components/ChainImg'
import TokenImg from '../../../components/TokenImg'
import { useMemo } from 'react'

export function Minibars({ series, className }: { series: number[], className?: string }) {
	const maxBar = 100
	const maxSeries = Math.max(...series)
	const scale = maxBar / maxSeries
	const bars = series.map(value => Math.round(scale * value) || 1)
	return <div className={`flex items-end gap-2 ${className}`}>
		{bars.map((bar, index) => <div key={index} className={`
			w-full h-[${bar}%] bg-neutral-400 group-active:bg-secondary-400
      ${index === 0 ? 'rounded-bl-sm' : ''}
      ${index === bars.length - 1 ? 'rounded-br-sm' : ''}
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

  return <div className={`p-2 text-xs rounded-full ${bgClassName} ${textClassName} group-active:text-inherit`}>
    {label}
  </div>
}

export function ListItem({ item }: { item: FinderItem }) {
  return <a href={getItemHref(item)} className={`
    group relative p-3 sm:px-6 xl:px-8 xl:py-5 flex items-center gap-6 xl:gap-12
    border-primary border-transparent hover:border-secondary-200 active:border-secondary-400
    saber-glow bg-black rounded-primary cursor-pointer
    active:text-secondary-400`}>
    <div className="grow w-[300px] flex flex-col gap-2">
      <div className="font-fancy text-2xl">
        <AutoTextSize mode="box" minFontSizePx={16}>{item.name}</AutoTextSize>
      </div>
      <div className="flex items-center gap-4">
        <ChainImg chainId={item.chainId} size={28} />
        <TokenImg chainId={item.chainId} address={item.token?.address} size={28}  />
        <Label item={item} />
        <div className="p-2 bg-neutral-900 text-xs text-neutral-400 group-active:text-inherit rounded-full">{fEvmAddress(item.address)}</div>
      </div>
    </div>
    <div className="w-[100px] flex items-center justify-center">
      <Minibars series={item.sparklines?.tvl ?? []} className="w-[80px] h-[56px]" />
    </div>
    <div className="w-[140px]">
      <div className="text-2xl font-bold">
        {fUSD(item.tvl ?? 0)}
      </div>
    </div>
    <div className="w-[100px]">
      <div className="text-2xl font-bold">
        {fPercent(item.apy ?? 0)}
      </div>
    </div>
  </a>
}
