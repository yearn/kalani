import { useAccount } from 'wagmi'
import Connect from '../../components/Connect'
import CTA from '../../components/CTA'
import Finder from '../../components/Finder'
import Launcher from '../../components/Launcher'
import SelectProject, { useSelectedProject } from '../../components/SelectProject'
import { cn } from '../../lib/shadcn'

export default function Header({
  disableFinderSuggestions,
  className,
}: {
  disableFinderSuggestions?: boolean
  className?: string
}) {
  const { isConnected } = useAccount()
  const { setSelectedProject } = useSelectedProject()
  return <header
    className={cn(`bg-primary-2000/60 backdrop-blur border-b-primary border-primary-1000`, className)}>
    <div className="mx-auto w-full h-20 pl-32 pr-6 flex items-center justify-between gap-4">
      <div className="grow flex items-center justify-start">
        <Finder
          className="!w-[32rem]"
          inputClassName="px-4 py-2 border-transparent"
          placeholder="Vault / Token / 0x"
          disableSuggestions={disableFinderSuggestions}
        />
      </div>
      <div className={`flex items-center justify-end gap-4`}>
        {isConnected && <SelectProject onSelect={setSelectedProject} inputClassName="h-11 border-transparent" />}
        <Connect label={<CTA>Connect</CTA>} />
        <Launcher alignRight={true} />
      </div>
    </div>
  </header>
}
