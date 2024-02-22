import { Strategy } from '@/lib/types/Strategy'
import { useMemo } from 'react'
import A from '../controls/A'
import { networks } from '@/lib/networks'
import { truncateHex } from '@yearn-finance/web-lib/utils/address'

function Tag({ tag, className }: { tag: string, className?: string }) {
  return <div className={`
    px-2 py-1 
    text-xs text-neutral-400
    bg-pink-900/20 border-pink-400/20 
    rounded ${className}`}>
    {tag}
  </div>
}

export default function Strategy({ strategy }: { strategy: Strategy }) {
  const network = useMemo(() => networks(strategy.chainId), [strategy])

  const firstStrategy = useMemo(() => {
    if(!strategy.strategyAddresses.length) return ''
    return strategy.strategyAddresses[0]
  }, [strategy])

  const explorerUrl = useMemo(() => {
    return `${network.blockExplorers.default.url}/address/${firstStrategy}`
  }, [network, firstStrategy])

  const status = useMemo(() => {
    const closed = strategy.githubIssueState === 'closed'
    if(closed) return 'closed'
    const running = strategy.githubIssueLabels.includes('running')
    return running ? 'running' : 'pending'
  }, [strategy])

  const statusClassName = useMemo(() => {
    if(status === 'pending') return 'text-orange-200 border border-dotted border-orange-200'
    if(status === 'running') return 'text-green-600 border border-dotted border-green-600'
    if(status === 'closed') return 'text-pink-600 border border-dotted border-pink-600'
    return ''
  }, [status])

  return <div className="w-full p-4 flex flex-col gap-4 bg-pink-900/20 rounded">
    <div className="flex items-center justify-between">
      <div className="text-base font-bold">{strategy.strategyName}</div>
      <div className="pr-4 flex items-center gap-2">
        <Tag tag={network.name} />
        <div className="text-xs">
          <A href={explorerUrl} target="_blank" rel="noopener noreferrer" className="a">{truncateHex(firstStrategy, 4)}</A>
        </div>
      </div>
    </div>

    <div className="px-4 py-3 flex items-center justify-between bg-neutral-900 rounded">
      <div className="text-xs">
        <A href={strategy.githubIssueHtmlUrl} target="_blank" rel="noopener noreferrer" className="a">yHaaS automation</A>
      </div>
      <div className="flex items-center gap-2">
        <Tag tag={strategy.harvestFrequency} />
        <Tag tag={status} className={statusClassName} />
      </div>
    </div>
  </div>
}
