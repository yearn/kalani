import { AnchorHTMLAttributes, ReactNode } from 'react'
import { PiMagnifyingGlass, PiRobot, PiVault, PiWallet } from 'react-icons/pi'
import { cn } from '../../lib/shadcn'
import { Link } from 'react-router-dom'

type DrawerButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string,
  className?: string,
  children: ReactNode,
}

const DrawerButtonClassName = `group
p-3 flex items-center justify-center
bg-black border border-transparent rounded-primary
hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
active:text-secondary-200 active:border-secondary-200
saber-glow
`

const DrawerButton: React.FC<DrawerButtonProps> = ({ className, children, ...props }) => (
  <Link {...props} className={cn(DrawerButtonClassName, className)}>
    {children}
  </Link>
)

DrawerButton.displayName = 'DrawerButton'

export default function Drawer({
  className,
}: {
  className?: string
}) {
  return <div className={cn(`
    py-4 flex flex-col items-center justify-start gap-6
    bg-primary-2000 border-r border-primary-1000`, className)}>

    <DrawerButton to="/home" title="Home">
      <PiWallet size={26} />
    </DrawerButton>

    <DrawerButton to="/explore" title="Explore">
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
