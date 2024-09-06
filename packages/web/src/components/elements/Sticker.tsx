import { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/shadcn'
import GlowGroup from './GlowGroup'

type StickerProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string,
  className?: string,
  children: ReactNode,
}

const stickerClassName = `
px-8 py-2
border border-transparent
bg-neutral-950 text-neutral-400
group-hover:bg-black group-hover:border-secondary-50 group-hover:text-secondary-50
group-active:text-secondary-200 group-active:border-secondary-200
rounded-primary`

const Sticker: React.FC<StickerProps> = ({ className, children, ...props }) => (
  <GlowGroup>
    <Link {...props} className={cn(stickerClassName, className)}>
      {children}
    </Link>
  </GlowGroup>
)

export default Sticker
