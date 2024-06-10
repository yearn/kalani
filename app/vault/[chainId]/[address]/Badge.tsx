import { ThemeName } from '@/lib/types'
import { useMemo } from 'react'
import { IconType } from 'react-icons/lib'

export default function Badge({
  label,
  icon: Icon,
  enabled,
}: {
  label: string,
  icon: IconType,
  enabled?: boolean
}) {
  const bgClassName = useMemo(() => enabled ? 'bg-secondary-400' : 'bg-neutral-900', [enabled])
  const fillClassName = useMemo(() => enabled ? 'fill-neutral-200/30' : 'fill-neutral-800', [enabled])
  const labelClassName = useMemo(() => enabled ? 'text-secondary-400' : 'text-neutral-700', [enabled])

  return <div className="flex flex-col items-center gap-2">
    <div className={`relative p-[1px] rounded-primary`}>
      <div className={`p-4 rounded-primary ${bgClassName}`}>
        <Icon size={64} className={fillClassName} />
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <div className={labelClassName}>{label}</div>
    </div>
  </div>
}
