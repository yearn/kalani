import RetroGrid from '../../components/magicui/retro-grid-claude'
import { cn } from '../../lib/shadcn'

function PlaneteryDisc({ className }: { className: string }) {
  return <div className={cn('absolute rounded-full', className)}></div>
}

function Planet({ planeteryClassName, className }: { planeteryClassName: string, className?: string }) {
  return <div className={cn('absolute', planeteryClassName, className)}>
    <PlaneteryDisc className={cn('top-[0px] left-[30px] bg-primary-800 blur-3xl', planeteryClassName)} />
    <PlaneteryDisc className={cn('inset-0 bg-black', planeteryClassName)} />
  </div>
}

export default function Bg() {
  return <div className={`
    isolate fixed -z-[1] inset-0 bg-primary-950`}>
    <div className="relative h-full w-full flex items-start justify-start overflow-hidden">
      <RetroGrid />
      <div className="absolute w-full h-[50%] bg-black shadow-lg overflow-hidden">
        <Planet planeteryClassName="-bottom-[600px] -left-[200px] size-[1120px] rotate-0" />
      </div>
    </div>
  </div>
}
