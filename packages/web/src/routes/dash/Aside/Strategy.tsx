import { useCallback, useMemo } from 'react'
import { useStrategyFromParams } from '../../../hooks/useStrategy'
import { useIsRelayed } from '../Yhaas/Whitelist/TargetForm/StrategyForm/useIsRelayed'
import { PiRobot } from 'react-icons/pi'
import ReactTimeago from 'react-timeago'
import { useNavigate } from 'react-router-dom'
import { useWhitelist } from '../Yhaas/Whitelist/useWhitelist'
import Notification from './Notification'

function useNotifications() {
  const navigate = useNavigate()
  const { setTargets, setTargetsRaw } = useWhitelist()
  const { strategy } = useStrategyFromParams()
  const { data: isRelayed } = useIsRelayed({ chainId: strategy.chainId, strategy: strategy.address })

  const onFixYhaas = useCallback(() => {
    if (!strategy) { return }
    setTargetsRaw(strategy.address)
    setTargets([strategy.address])
    navigate(`/yhaas`)
  }, [strategy, navigate, setTargets, setTargetsRaw])

  return useMemo(() => {
    const result: React.ReactNode[] = []
    if (!isRelayed) {
      result.push(<Notification 
        id={`strategy-vitals-yhaas-${strategy?.address}`} 
        key={`strategy-vitals-yhaas-${strategy?.address}`} 
        authorized={true}
        icon={PiRobot} onFix={onFixYhaas}>
          yHaaS disabled
        </Notification>
      )
    }
    return result
  }, [strategy, isRelayed])
}

export default function Strategy() {
  const { strategy } = useStrategyFromParams()
  const { data: isRelayed } = useIsRelayed({ chainId: strategy.chainId, strategy: strategy.address })
  const notifications = useNotifications()

  return <div className="w-full flex flex-col gap-8">
    {notifications.length > 0 && <div className="flex flex-col gap-6">
      {notifications}
    </div>}
    <div className="border-primary border-neutral-900 rounded-primary p-8">
      <div>
        <div className="text-lg font-bold text-neutral-400">Latest Report</div>
        <div className="flex">
          <ReactTimeago enabled={isRelayed.toString()} date={Number(strategy.lastReportDetail?.blockTime ?? 0) * 1000} />
        </div>
      </div>
    </div>
  </div>
}
