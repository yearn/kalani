import Badge from './Badge'
import { PiTractorFill } from 'react-icons/pi'

export default function Slot() {
  return <div>
    <div className="flex flex-col items-center justify-center gap-12">
      <Badge label="yHaaS" icon={PiTractorFill} />
    </div>
  </div>
}
