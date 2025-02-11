import { useMemo } from 'react'
import { motion, Transition } from 'framer-motion'
import { springs } from '../../lib/motion'

export default function FlyInFromLeft({ 
  _key,
  transition = springs.roll,
  parentMounted,
  x = { start: -8, end: 0 },
  breakpoint = true,
  className,
  children 
}: { 
  _key: string,
  transition?: Transition,
  parentMounted?: boolean,
  x?: { start: number, end: number },
  breakpoint?: boolean,
  className?: string,
  children: React.ReactNode 
}) {
  const initial = useMemo(() => 
    (parentMounted === true || parentMounted === undefined) ? { x: x.start, opacity: 0 } : false,
  [parentMounted, x.start])

  if (breakpoint) return <motion.div className={className}
    key={`motion-${_key}`}
    transition={transition}
    initial={initial}
    animate={{ x: x.end, opacity: 1 }} >
    {children}
  </motion.div>

  return <div className={className}>
    {children}
  </div>
}
