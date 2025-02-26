import { PiDotsNine, PiEqualsBold, PiMagnifyingGlass, PiRobot, PiVault, PiWallet, PiX } from 'react-icons/pi'
import { cn } from '../../lib/shadcn'
import { useHashNav } from '../../hooks/useHashNav'
import FlyInFromBottom from '../motion/FlyInFromBottom'
import { IconType } from 'react-icons/lib'
import Connect from '../Connect'
import { useLocation, useNavigate } from 'react-router-dom'
import Launcher from '../Launcher'
import Aside from '../../routes/dash/Aside'
import { useMenuBar } from './useMenuBar'

const HIDE_ASIDE_FOR_ROUTES = ['/', '/explore', '/build', '/yhaas']

function MenuBarButton({ icon, title, onClick }: { icon: IconType, title: string, onClick: () => void }) {
  return <div onClick={onClick} className="w-full py-6 flex items-center active:bg-primary-600">
    <div className="px-6">{icon({ size: 48 })}</div>
    <div className="text-2xl">{title}</div>
  </div>
}

export default function MenuBar({ className }: { className?: string }) {
  const location = useLocation()
  const navigate = useNavigate()
  const menu = useHashNav('menu')
  const launcher = useHashNav('launcher')
  const { theme } = useMenuBar()

  return <div className={cn('sm:hidden fixed z-50 inset-0 flex flex-col justify-end pointer-events-none', className)}>

    {menu.isOpen && <FlyInFromBottom _key="menu-bar" className="relative grow bg-secondary-2000 pointer-events-auto overflow-auto">
      <div className="px-6 py-6 flex items-center justify-end text-black">
        <PiX size={32} onClick={menu.close} />
      </div>

      {!HIDE_ASIDE_FOR_ROUTES.includes(location.pathname) && <div className="mt-16">
        <Aside />
        <div className="w-full my-16 border-primary border-b border-black"></div>
      </div>}

      <div className="px-6 flex flex-col">
        <Connect />
      </div>

      <div className="w-full my-16 border-primary border-b border-black"></div>

      <div className="mb-32 flex flex-col items-start justify-center">
        <MenuBarButton icon={PiWallet} title="Account" onClick={() => navigate('/', { replace: true })} />
        <MenuBarButton icon={PiMagnifyingGlass} title="Explore" onClick={() => navigate('/explore', { replace: true })} />
        <MenuBarButton icon={PiVault} title="Build" onClick={() => navigate('/build', { replace: true })} />
        <MenuBarButton icon={PiRobot} title="yHaaS" onClick={() => navigate('/yhaas', { replace: true })} />
        <MenuBarButton icon={PiDotsNine} title="yEcosystem" onClick={launcher.open} />
      </div>
    </FlyInFromBottom>}

    {!menu.isOpen && <div className="pb-8 w-full flex flex-row items-center justify-center pointer-events-none">
      <button onClick={menu.open} className={cn(`
        px-8 py-2 bg-neutral-950
        outline outline-4 outline-black/80
        hover:outline-secondary-200
        active:outline-secondary-400
        active:bg-black
        saber-glow rounded-primary pointer-events-auto`,
        theme === 'warn' && 'text-warn-400 theme-warn')}>
        <PiEqualsBold size={32} />
      </button>
    </div>}

    <Launcher hideToggle={true} />
  </div>
}
