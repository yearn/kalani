import { useState } from 'react'
import { cn } from '../../lib/shadcn'
import { springs } from '../../lib/motion'
import FlyInFromBottom from '../motion/FlyInFromBottom'

export default function ChipSlide({
  className,
  slide,
  children,
  style
}: {
  className?: string
  slide?: React.ReactNode
  children?: React.ReactNode
  style?: React.CSSProperties
}) {
  const [isHovered, setIsHovered] = useState(false)
  return <div 
    className={cn('relative px-3 py-1 inline-flex items-center bg-black rounded-full cursor-default', className)}
    style={style}
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}>
    <div>{children}</div>
    {isHovered && <div 
      className={cn('absolute z-10 inset-0 flex items-center justify-center bg-black rounded-full', className)}
      style={style}
    >
      <FlyInFromBottom _key="chip-slide-in" transition={springs.roll}>
        <div>{slide}</div>
      </FlyInFromBottom>
    </div>}
  </div>
}
