import { isNothing } from '@kalani/lib/strings'
import { cn } from '../../lib/shadcn'
import Info from '../Info'

export default function LabelValueRow({
  label,
  infoKey,
  className,
  children
}: {
  label: string,
  infoKey?: string,
  className?: string,
  children: React.ReactNode
}) {
  return <div className={cn(`
    px-2 sm:px-6 py-2 w-full flex flex-wrap gap-3 items-center
    text-xl sm:text-2xl rounded-primary even:bg-secondary-1500`,
    className
  )}>
    <div className={cn('flex gap-2 items-center', isNothing(label) && 'hidden')}>
      <span>{label}</span>
      {infoKey && <Info _key={infoKey} />}
    </div>
    <div className="flex-1 flex justify-end break-all">{children}</div>
  </div>
}
