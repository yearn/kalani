import { AnchorHTMLAttributes, ReactNode, useMemo } from 'react'
import { PiMagnifyingGlass, PiRobot, PiVault, PiWallet } from 'react-icons/pi'
import { cn } from '../../lib/shadcn'
import { Link, useLocation } from 'react-router-dom'
import ScaleIn from '../../components/motion/ScaleIn'

type DrawerButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string,
  activeIfStartsWith?: string[],
  className?: string,
  children: ReactNode,
}

const DrawerButtonClassName = `
p-3 flex items-center justify-center
bg-black border-primary border-transparent rounded-primary
hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
group-active:text-secondary-400 group-active:border-secondary-400
saber-glow
`

function DrawerButton({ activeIfStartsWith, className, children, ...props }: DrawerButtonProps) {
  const location = useLocation()
  const isActiveRoute = useMemo(() => {
    return location.pathname === props.to || activeIfStartsWith?.some(startsWith => location.pathname.startsWith(startsWith))
  }, [activeIfStartsWith, location, props.to])

  return <div className={cn('group relative w-full flex items-center justify-center', className)}>
    <Link {...props} className={cn(DrawerButtonClassName)}>
      {children}
    </Link>
    <div className={`absolute inset-0 hidden group-active:flex items-center justify-start pointer-events-none`}>
      <div className="w-1 h-2 bg-secondary-50/20 rounded-r-full"></div>
    </div>
    <div className={`absolute inset-0 flex items-center justify-start pointer-events-none`}>
      {isActiveRoute && <ScaleIn _key="drawer-active-indicator">
        <div className="w-1 h-8 bg-secondary-50 group-active:bg-secondary-400 rounded-r-full"></div>
      </ScaleIn>}
    </div>
  </div>
}

DrawerButton.displayName = 'DrawerButton'

export default function Drawer({
  className,
}: {
  className?: string
}) {
  return <div className={cn(`
    py-4 flex flex-col items-center justify-start gap-6
    bg-primary-2000 border-r border-primary-1000`, className)}>

    <DrawerButton to="/" title="Home">
      <PiWallet size={26} />
    </DrawerButton>

    <DrawerButton to="/explore" title="Explore" activeIfStartsWith={[
      '/vault', '/strategy', '/erc4626', '/accountant', '/account'
      ]}>
      <PiMagnifyingGlass size={26} />
    </DrawerButton>

    <DrawerButton to="/build" title="Build">
      <PiVault size={26} />
    </DrawerButton>

    <DrawerButton to="/yhaas" title="Automation">
      <PiRobot size={26} />
    </DrawerButton>
  </div>
}
