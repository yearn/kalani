import { useCallback, useMemo } from 'react'
import { useStrategyFromParams } from '../../../hooks/useStrategy'
import { useIsRelayed } from '../Yhaas/Whitelist/TargetForm/StrategyForm/useIsRelayed'
import { PiRobot } from 'react-icons/pi'
import ReactTimeago from 'react-timeago'
import { useNavigate } from 'react-router-dom'
import { useWhitelist } from '../Yhaas/Whitelist/useWhitelist'
import { FixItNotification } from './Notification'
import { useManagement } from '../Strategy/useManagement'
import { useAccount } from 'wagmi'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { fPercent } from '@kalani/lib/format'
import LinkButton from '../../../components/elements/LinkButton'
import { getChain } from '../../../lib/chains'
import DepositWithdraw from '../../../components/DepositWithdraw'

function useNotifications() {
  const navigate = useNavigate()
  const { address } = useAccount()
  const { setTargets, setTargetsRaw } = useWhitelist()
  const { strategy } = useStrategyFromParams()
  const { data: isRelayed } = useIsRelayed({ chainId: strategy.chainId, strategy: strategy.address })

  const { management } = useManagement(strategy.chainId, strategy.address)
  const authorized = useMemo(() => compareEvmAddresses(management, address), [management, address])

  const onFixYhaas = useCallback(() => {
    if (!strategy) { return }
    setTargetsRaw(strategy.address)
    setTargets([strategy.address])
    navigate(`/yhaas`)
  }, [strategy, navigate, setTargets, setTargetsRaw])

  return useMemo(() => {
    const result: React.ReactNode[] = []
    if (!isRelayed && authorized) {
      result.push(<FixItNotification 
        id={`strategy-vitals-yhaas-${strategy?.address}`} 
        key={`strategy-vitals-yhaas-${strategy?.address}`} 
        authorized={authorized}
        icon={PiRobot} onFix={onFixYhaas}>
          yHaaS disabled
        </FixItNotification>
      )
    }
    return result
  }, [strategy, isRelayed, authorized])
}

export default function Strategy() {
  const { strategy } = useStrategyFromParams()
  const { data: isRelayed } = useIsRelayed({ chainId: strategy.chainId, strategy: strategy.address })
  const notifications = useNotifications()

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
      className={`p-10 flex items-center justify-between border-primary border-neutral-900 rounded-primary`}>
      <div>
        <div className="text-lg font-bold text-neutral-400 group-active:text-inherit">Latest Report</div>
        <div className="flex">
          <ReactTimeago enabled={isRelayed.toString()} date={Number(strategy.lastReportDetail?.blockTime ?? 0) * 1000} />
        </div>
      </div>
      <div className="text-sm">
        {fPercent(strategy.lastReportDetail?.apr?.net ?? 0)} APR
      </div>
    </LinkButton>
    <DepositWithdraw chainId={strategy.chainId} vault={strategy.address} />
  </div>
}
