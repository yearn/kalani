import { useMemo } from 'react'
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
  const fillClassName = useMemo(() => enabled ? 'fill-secondary-100' : 'fill-neutral-800', [enabled])
  const labelClassName = useMemo(() => enabled ? 'text-secondary-100' : 'text-neutral-700', [enabled])
  return <div className="flex items-center bg-neutral-950 rounded-primary">
    <div className={`px-6 rounded-primary`}>
      <Icon size={32} className={fillClassName} />
    </div>
    <div className={`px-2 py-3 flex flex-col ${labelClassName}`}>
      <div className="flex items-center gap-2 text-sm">
        {enabled && <PiCheck size={16} className={fillClassName} />}
        {!enabled && <PiX size={16} className={fillClassName} />}
        <div>{label}</div>
      </div>
      <p>
        .. . ...... . ....... . ... . ....... ..... ... ...
      </p>
    </div>
  </div>
}
