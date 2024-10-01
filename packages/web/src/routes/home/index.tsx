import { useAccount } from 'wagmi'
import Drawer from '../dash/Drawer'
import Header from '../dash/Header'
import Account from '../dash/Account/Account'
import { zeroAddress } from 'viem'
import { PiDotsNine, PiEqualsBold, PiMagnifyingGlass, PiRobot, PiVault, PiWallet, PiX } from 'react-icons/pi'
import { cn } from '../../lib/shadcn'
import { useHashNav } from '../../hooks/useHashNav'
import FlyInFromBottom from '../../components/motion/FlyInFromBottom'
import { IconType } from 'react-icons/lib'
import Connect from '../../components/Connect'
import { useNavigate } from 'react-router-dom'
import Launcher from '../../components/Launcher'

function MenuBarButton({ icon, title, onClick }: { icon: IconType, title: string, onClick: () => void }) {
  return <div onClick={onClick} className="w-full py-6 flex items-center active:bg-primary-600">
    <div className="px-6">{icon({ size: 48 })}</div>
    <div className="text-2xl">{title}</div>
  </div>
}

function MenuBar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const menu = useHashNav('menu')
  const launcher = useHashNav('launcher')
  return <div className={cn('fixed inset-0 flex flex-col justify-end pointer-events-none', className)}>

    {menu.isOpen && <FlyInFromBottom _key="menu-bar" className="relative grow bg-primary-2000 pointer-events-auto">
      <div className="px-6 py-6 flex items-center justify-end text-neutral-500">
        <PiX size={32} onClick={menu.close} />
      </div>
      <div className="pb-10 flex flex-col border-b border-neutral-900">
        <div className="px-6">
          <Connect />
        </div>
      </div>
      <div className="flex flex-col items-start justify-center">
        <MenuBarButton icon={PiWallet} title="Account" onClick={() => navigate('/', { replace: true })} />
        <MenuBarButton icon={PiMagnifyingGlass} title="Explore" onClick={() => navigate('/explore', { replace: true })} />
        <MenuBarButton icon={PiVault} title="Build" onClick={() => navigate('/build', { replace: true })} />
        <MenuBarButton icon={PiRobot} title="yHaaS" onClick={() => navigate('/yhaas', { replace: true })} />
        <MenuBarButton icon={PiDotsNine} title="yEcosystem" onClick={launcher.open} />
      </div>
    </FlyInFromBottom>}

    {!menu.isOpen && <div className="px-6 py-4 w-full flex flex-row items-center justify-center pointer-events-none">
      <button onClick={menu.open} className="px-8 py-3 bg-neutral-950 rounded-primary pointer-events-auto">
        <PiEqualsBold size={24} />
      </button>
    </div>}

    <Launcher />
  </div>
}

export default function Home() {
  const { address } = useAccount()
 
  return <div className={`
    w-full min-h-screen sm:max-h-auto
    flex sm:block flex-col justify-between`}>
    <Header className="hidden sm:block fixed z-50 inset-x-0 top-0 w-full" />
    <Drawer className="hidden sm:flex fixed z-50 top-0 left-0 w-24 h-screen" />

    <div className="grow sm:grow-0 flex items-start">
      <div className="hidden sm:block min-w-24"></div>

      <div className={`
        isolate grow w-full sm:min-h-screen
        sm:flex sm:flex-col sm:justify-start sm:border-r sm:border-r-primary-1000`}>
        <div className="hidden sm:block w-full h-20 border-b border-transparent"></div>
        <Account address={address ?? zeroAddress} />
      </div>

      <aside className={`hidden sm:block min-w-[26%] px-8 py-12 h-screen`}>
        <div className="max-w-[380px]"></div>
      </aside>
    </div>

    <MenuBar className="sm:hidden" />
  </div>
}
