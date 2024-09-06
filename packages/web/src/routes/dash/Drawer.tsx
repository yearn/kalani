import { AnchorHTMLAttributes, ReactNode } from 'react'
import { PiRabbitFill, PiWalletFill } from 'react-icons/pi'
import { cn } from '../../lib/shadcn'
import { Link } from 'react-router-dom'
import { Yearn } from '../../assets/icons/Yearn'
import GlowGroup from '../../components/elements/GlowGroup'

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
`

const DrawerButton: React.FC<DrawerButtonProps> = ({ className, children, ...props }) => (
  <GlowGroup>
    <Link {...props} className={cn(DrawerButtonClassName, className)}>
      {children}
    </Link>
  </GlowGroup>
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

    <DrawerButton to="/" title="Lander">
      <Yearn className="size-6" back="text-transparent" front="text-neutral-200" />
    </DrawerButton>

    <DrawerButton to="/account" title="Account dash">
      <PiWalletFill size={26} />
    </DrawerButton>

    <DrawerButton to="/yhaas" title="yHaaS dash">
      <PiRabbitFill size={26} />
    </DrawerButton>
  </div>
}
