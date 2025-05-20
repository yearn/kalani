import { ReactNode, useMemo } from 'react'
import { useStrategyFromParams } from '../../../hooks/useStrategy'
import ReactTimeago from 'react-timeago'
import { fPercent } from '@kalani/lib/format'
import LinkButton from '../../../components/elements/LinkButton'
import { getChain } from '../../../lib/chains'
import DepositWithdraw from '../../../components/DepositWithdraw'

export default function Strategy() {
  const { strategy } = useStrategyFromParams()
  const notifications = [] as ReactNode[]

  const chain = useMemo(() => getChain(strategy.chainId), [strategy.chainId])
  const latestReportHref = useMemo(() => {
    const explorer = chain.blockExplorers.default
    return `${explorer.url}/tx/${strategy.lastReportDetail?.transactionHash}`
  }, [chain, strategy])

  return <div className="w-full flex flex-col gap-8">
    {notifications.length > 0 && <div className="flex flex-col gap-6">
      {notifications}
    </div>}
    <LinkButton h="secondary" to={latestReportHref} 
      target="_blank" rel="noreferrer"
      className={'p-10 flex items-center justify-between border-primary border-black rounded-primary'}>
      <div>
        <div className="text-lg font-bold text-neutral-400 group-active:text-inherit">Latest Report</div>
        <div className="flex">
          <ReactTimeago date={Number(strategy.lastReportDetail?.blockTime ?? 0) * 1000} />
        </div>
      </div>
      <div className="text-sm">
        {fPercent(strategy.lastReportDetail?.apr?.net ?? 0)} APR
      </div>
    </LinkButton>
    <DepositWithdraw chainId={strategy.chainId} vault={strategy.address} />
  </div>
}
