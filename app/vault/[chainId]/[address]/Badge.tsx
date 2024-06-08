import Screen from '@/components/Screen'
import { IconType } from 'react-icons/lib'
import { PiX } from 'react-icons/pi'

export default function Badge({
  label,
  icon: Icon
}: {
  label: string,
  icon: IconType
}) {
  return <div className="flex flex-col items-center gap-3">
    <div className="relative p-1 rounded-primary theme-nudge">
      <Screen className="p-4 bg-neutral-950">
        <Icon size={64} className="fill-neutral-900" />
      </Screen>
    </div>
    <div className="flex items-center gap-2">
      <div className="text-red-400">{label}</div>
    </div>
  </div>
}