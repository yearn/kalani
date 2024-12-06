import { useLocation } from 'react-router-dom'
import Connect from '../../components/Connect'
import CTA from '../../components/CTA'
import Finder from '../../components/Finder'
import Launcher from '../../components/Launcher'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { cn } from '../../lib/shadcn'
import { useMemo } from 'react'

export default function Header({
  className
}: {
  disableFinderSuggestions?: boolean
  className?: string
}) {
  const { sm } = useBreakpoints()
  const { pathname } = useLocation()
  const disableSuggestions = useMemo(() => pathname === '/explore', [pathname])

  return <header
    className={cn(`bg-grill-950 border-b-primary border-neutral-900`, className)}>
    <div className="mx-auto w-full h-20 pl-32 pr-6 flex items-center justify-between gap-4">
      <div className="grow flex items-center justify-start">
        <Finder
          className="!w-[32rem]"
          inputClassName="px-4 py-2 border-transparent"
          placeholder="Vault / Token / 0x"
          disableSuggestions={disableSuggestions}
          disabled={!sm}
        />
      </div>
      <div className={`flex items-center justify-end gap-4`}>
        <Connect label={<CTA>Connect</CTA>} />
        <Launcher alignRight={true} />
      </div>
    </div>
  </header>
}
