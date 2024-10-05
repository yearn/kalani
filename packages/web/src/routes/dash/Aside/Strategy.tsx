import Badge from './Badge'
import { PiRobot } from 'react-icons/pi'

export default function Strategy() {
  return <div>
    <div className="flex flex-col items-center justify-center gap-12">
      <div className="text-lg font-bold text-neutral-400">Latest Report</div>
      <Badge label="yHaaS" icon={PiRobot} />
    </div>
  </div>
}
