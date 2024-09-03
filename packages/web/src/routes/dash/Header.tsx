import Connect from '../../components/Connect'
import Finder from '../../components/Finder'
import Launcher from '../../components/Launcher'
import { cn } from '../../lib/shadcn'

export default function Header({
  className,
}: {
  className?: string
}) {
  return <header
    className={cn(`bg-primary-2000/60 backdrop-blur border-b border-primary-1000`, className)}>
    <div className="mx-auto w-full h-20 pl-32 pr-6 flex items-center justify-between">
      <div className="grow flex items-center justify-start gap-12">
        <Finder
          className="w-[32rem]"
          inputClassName="px-4 py-2 border-transparent"
          placeholder="vault / token / 0x" />
      </div>
      <div className={`flex items-center justify-end gap-4`}>
        <Connect />
        <Launcher alignRight={true} />
      </div>
    </div>
  </header>
}