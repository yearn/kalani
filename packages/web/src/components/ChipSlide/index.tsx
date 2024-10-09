import { useState } from 'react'
import { cn } from '../../lib/shadcn'
import { springs } from '../../lib/motion'
import FlyInFromLeft from '../motion/FlyInFromLeft'

export default function ChipSlide({
  className,
  slide,
  children
}: {
  className?: string
  slide?: React.ReactNode
  children?: React.ReactNode
}) {
  const [isHovered, setIsHovered] = useState(false)
  return <div className={cn('relative px-3 py-1 rounded-full hover:rounded-r-none flex items-center cursor-default', className)}
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}>
    <div>{children}</div>
    {isHovered && <div className="absolute z-10 top-0 bottom-0 left-full h-full">
      <FlyInFromLeft _key="chip-slide" transition={springs.glitch} className="h-full">
        <div className={cn('h-full px-3 py-1 rounded-r-full', className)}>{slide}</div>
      </FlyInFromLeft>
    </div>}
  </div>
}
