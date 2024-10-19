import { useStrategyFromParams } from '../../../hooks/useStrategy'
import { useIsRelayed } from '../Yhaas/Whitelist/TargetForm/StrategyForm/useIsRelayed'
import Badge from './Badge'
import { PiRobot } from 'react-icons/pi'
import ReactTimeago from 'react-timeago'

export default function Strategy() {
  const { strategy } = useStrategyFromParams()
  const { data: isRelayed } = useIsRelayed({ chainId: strategy.chainId, strategy: strategy.address })

  return <div>
    <div className="flex flex-col items-start gap-12">
      <div>
        <div className="text-lg font-bold text-neutral-400">Latest Report</div>
        <div className="flex">
          <div className="">
            <ReactTimeago enabled={isRelayed} date={Number(strategy.lastReportDetail?.blockTime ?? 0) * 1000} />
          </div>
        </div>
      </div>


      <Badge label="yHaaS" icon={PiRobot} enabled={isRelayed} />

    </div>
  </div>
}
