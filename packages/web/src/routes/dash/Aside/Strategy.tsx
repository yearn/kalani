import { Suspense } from 'react'
import { useStrategyFromParams } from '../../../hooks/useStrategy'
import Badge from './Badge'
import { PiRobot } from 'react-icons/pi'
import ReactTimeago from 'react-timeago'

function Suspender() {
  const { strategy } = useStrategyFromParams()
  return <div>
    <div className="flex flex-col items-start gap-12">
      <div>
        <div className="text-lg font-bold text-neutral-400">Latest Report</div>
        <div className="flex">
          <div className="">
            <ReactTimeago date={Number(strategy.lastReportDetail?.blockTime ?? 0) * 1000} />
          </div>
        </div>
      </div>

      <Badge label="yHaaS" icon={PiRobot} />
    </div>
  </div>
}

export default function Strategy() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Suspender />
  </Suspense>
}
