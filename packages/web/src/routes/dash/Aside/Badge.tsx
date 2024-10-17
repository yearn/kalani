import { IconType } from 'react-icons/lib'
import { PiCheck, PiX } from 'react-icons/pi'

export default function Badge({
  label,
  icon: Icon,
  enabled,
}: {
  label: string,
  icon: IconType,
  enabled?: boolean
}) {
  return <div data-open={enabled ?? false} className="group flex items-center bg-neutral-950 rounded-primary">
    <div className="px-6 rounded-primary">
      <Icon size={32} className="group-data-[open=true]:fill-secondary-100 group-data-[open=false]:fill-warn-400" />
    </div>
    <div className="px-2 py-3 flex flex-col group-data-[open=true]:text-secondary-100 group-data-[open=false]:text-warn-400">
      <div className="flex items-center gap-2 text-sm">
        {enabled && <PiCheck size={16} className="" />}
        {!enabled && <PiX size={16} className="" />}
        <div>{label}</div>
      </div>
      <p className="group-data-[open=true]:text-neutral-400 group-data-[open=false]:text-warn-600">
        .. . ...... . ....... . ... . ....... ..... ... ...
      </p>
    </div>
  </div>
}
