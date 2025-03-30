import { isNothing } from '@kalani/lib/strings'
import { cn } from '../../lib/shadcn'
import Info from '../Info'

export type ThemeName = 'default' | 'warning'

export default function LabelValueRow({
  label,
  infoKey,
  theme,
  className,
  children
}: {
  label: string,
  infoKey?: string,
  theme?: ThemeName | false,
  className?: string,
  children: React.ReactNode
}) {
  return <div className={cn(`
    px-2 sm:px-6 py-2 w-full flex flex-wrap gap-3 items-center
    text-xl xl:text-2xl rounded-primary even:bg-secondary-1500
    border-primary border-transparent`,
    theme === 'warning' && 'border-warn-400/20 border-dashed',
    theme === 'warning' && 'text-warn-400',
    className
  )}>
    <div className={cn('flex gap-2 items-center', isNothing(label) && 'hidden')}>
      <span className="max-w-[180px] sm:max-w-none">{label}</span>
      {infoKey && <Info _key={infoKey} />}
    </div>
    <div className="flex-1 flex justify-end break-all">{children}</div>
  </div>
}
