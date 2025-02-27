import { PiDotsNine, PiEqualsBold, PiMagnifyingGlass, PiRobot, PiVault, PiWallet } from 'react-icons/pi'
import { cn } from '../../lib/shadcn'
import { useHashNav } from '../../hooks/useHashNav'
import { IconType } from 'react-icons/lib'
import Connect from '../Connect'
import { useNavigate } from 'react-router-dom'
import Launcher from '../Launcher'
import { useMenuBar } from './useMenuBar'
import { useState, useEffect } from 'react'
import { useDialog } from '../Dialog/useDialog'
import Dialog from '../Dialog'

function MenuBarButton({ icon, title, onClick }: { icon: IconType, title: string, onClick: () => void }) {
  return <div onClick={onClick} className="w-full py-6 flex items-center active:bg-primary-600">
    <div className="px-6">{icon({ size: 48 })}</div>
    <div className="text-2xl">{title}</div>
  </div>
}

export default function MenuBar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const menu = useDialog('menu')
  const launcher = useHashNav('launcher')
  const { theme } = useMenuBar()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => { setIsScrolled(window.scrollY > 0) }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return <div className={cn('sm:hidden fixed z-50 inset-0 flex flex-col justify-start pointer-events-none', className)}>

    {<div className={`
      w-full h-[4.5rem] pl-6 pr-3 flex flex-row items-center justify-between
      border-b-primary ${isScrolled ? 'border-black' : 'border-transparent'}
      pointer-events-none bg-grill-950`}>
      <button onClick={menu.openDialog} className={cn('pointer-events-auto', theme === 'warn' && 'text-warn-400 theme-warn')}>
        <PiEqualsBold size={32} />
      </button>
      <Connect short={true} className="pointer-events-auto" />
    </div>}

    <Dialog dialogId={'menu'}>
      <div className="-mx-6 flex flex-col items-start justify-center">
        <MenuBarButton icon={PiWallet} title="Account" onClick={() => navigate('/', { replace: true })} />
        <MenuBarButton icon={PiMagnifyingGlass} title="Explore" onClick={() => navigate('/explore', { replace: true })} />
        <MenuBarButton icon={PiVault} title="Build" onClick={() => navigate('/build', { replace: true })} />
        <MenuBarButton icon={PiRobot} title="yHaaS" onClick={() => navigate('/yhaas', { replace: true })} />
        <MenuBarButton icon={PiDotsNine} title="yEcosystem" onClick={launcher.open} />
      </div>
    </Dialog>

    <Launcher hideToggle={true} />
  </div>
}
