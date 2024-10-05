import { Yearn } from '../../assets/icons/Yearn'
import RetroGrid from '../../components/magicui/retro-grid-claude'
import { cn } from '../../lib/shadcn'

function PlaneteryDisc({ className }: { className: string }) {
  return <div className={cn('absolute rounded-full', className)}></div>
}

function Planet({ planeteryClassName, className }: { planeteryClassName: string, className?: string }) {
  return <div className={cn('absolute', planeteryClassName, className)}>
    <PlaneteryDisc className={cn('top-[0px] left-[30px] bg-primary-300 blur-3xl', planeteryClassName)} />
    <PlaneteryDisc className={cn('inset-0 bg-primary-400', planeteryClassName)} />
    <div className={cn('absolute rounded-full inset-0 bg-primary-400 flex items-center justify-center', planeteryClassName)}>
      <Yearn back="text-primary-400" front="text-primary-300/60" className="w-3/4 h-3/4" />
    </div>
  </div>
}

export default function Bg({ className }: { className?: string }) {
  return <div className={cn(`
    isolate fixed -z-[1] inset-0 bg-primary-400`, className)}>
    <div className="relative h-full w-full flex items-start justify-start overflow-hidden">
      <RetroGrid />
      <div className="absolute w-full h-[50%] bg-primary-400 overflow-hidden">
        <Planet planeteryClassName="top-6 left-6 size-[200px]" />
      </div>
    </div>
  </div>
}
