import { fancy } from '@/lib/fancy'
import { PiRabbitFill } from 'react-icons/pi'

export default function Page() {
  return <div className="h-screen pt-12 pl-16">
    <div className="flex items-center gap-8">
      <PiRabbitFill size={64} />
      <div className="flex items-end gap-1">
        <div className={`text-4xl ${fancy.className}`}>y</div>
        <div className={`text-5xl ${fancy.className}`}>H</div>
        <div className={`text-4xl ${fancy.className}`}>aa</div>
        <div className={`text-5xl ${fancy.className}`}>S</div>
      </div>
    </div>
  </div>
}
