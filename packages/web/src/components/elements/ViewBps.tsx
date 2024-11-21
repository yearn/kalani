import { fBps, fPercent } from '@kalani/lib/format'
import { useInputBpsSettings } from '../elements/InputBps'
import { cn } from '../../lib/shadcn'

export default function ViewBps({ bps, className }: { bps: number, className?: string }) {
  const { setting: bpsSetting, next: nextBpsSetting } = useInputBpsSettings()
  return <div onClick={nextBpsSetting} title={bpsSetting} className={cn('px-3 py-1 inline cursor-pointer rounded-full', className)}>
    {bpsSetting === '%' ? fPercent(bps / 10_000) : fBps(bps)}
  </div>
}
