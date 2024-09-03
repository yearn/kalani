import { Yearn } from '@/components/icons/Yearn'
import { cn } from '@/lib/shadcn'
import Link, { LinkProps } from 'next/link'
import { AnchorHTMLAttributes, ReactNode } from 'react'
import { PiRabbitFill, PiWalletFill } from 'react-icons/pi'

type DrawerButtonProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string,
  children: ReactNode,
}

const DrawerButtonClassName = `group
px-6 py-3 flex items-center justify-center
bg-black rounded-primary
hover:bg-secondary-200 hover:text-black
active:bg-secondary-500
`

const DrawerButton: React.FC<DrawerButtonProps> = ({ className, children, href, ...props }) => (
  <Link href={href} {...props} className={cn(DrawerButtonClassName, className)}>
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
    bg-black border-r border-primary-1000`, className)}>

    <DrawerButton href="/" title="Megadash">
      <Yearn className="size-8 group-hover:invert" back="text-transparent" front="text-neutral-200" />
    </DrawerButton>

    <DrawerButton href="/account" title="Account dash">
      <PiWalletFill size={26} />
    </DrawerButton>

    <DrawerButton href="/yhaas" title="yHaaS dash">
      <PiRabbitFill size={26} />
    </DrawerButton>
  </div>
}
