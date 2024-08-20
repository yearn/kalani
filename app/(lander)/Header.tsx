'use client'

import { useEffect, useState } from 'react'
import Connect from '@/components/Connect'
import Launcher from '@/components/Launcher'
import { useAccount } from 'wagmi'
import { PiWalletFill } from 'react-icons/pi'
import Link from '@/components/elements/Link'

function Header() {
  const { isConnected } = useAccount()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
      fixed inset-x-0 top-0 z-50 w-full
      ${isScrolled ? 'bg-neutral-950/60 backdrop-blur' : ''}`}
    >
      <div className="mx-auto max-w-6xl h-20 flex items-center justify-between">
        <div className="grow flex items-center justify-start gap-12">
          {isConnected && <Link className="border-transparent" href="/account">
            <PiWalletFill size={26} />
          </Link>}
        </div>
        <div className={`flex items-center justify-end gap-4`}>
          <Connect />
          <Launcher alignRight={true} />
        </div>
      </div>
    </header>
  )
}

export default Header
