import { useEffect, useState } from 'react'
import { cn } from '../../lib/shadcn'
import { springs } from '../../lib/motion'
import FlyInFromBottom from '../motion/FlyInFromBottom'

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
  useEffect(() => {console.log(className)}, [className])
  return <div className={cn('relative px-3 py-1 inline-flex items-center rounded-full cursor-default', className)}
    onMouseEnter={() => setIsHovered(true)} 
    onMouseLeave={() => setIsHovered(false)}>
    <div>{children}</div>
    {isHovered && <div className={cn('absolute z-10 inset-0 flex items-center justify-center rounded-full', className)}>
      <FlyInFromBottom _key="chip-slide-in" transition={springs.roll}>
        <div>{slide}</div>
      </FlyInFromBottom>
    </div>}
  </div>
}
