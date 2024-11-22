import { cn } from '../../lib/shadcn'

export default function LabelValueRow({
  label,
  className,
  children
}: {
  label: string,
  className?: string,
  children: React.ReactNode
}) {
  return <div className={cn(`px-6 py-2 w-full flex items-center justify-between 
    rounded-primary even:bg-neutral-950`,
    className
  )}>
    <div>{label}</div>
    <div className="flex justify-end">{children}</div>
  </div>
}
