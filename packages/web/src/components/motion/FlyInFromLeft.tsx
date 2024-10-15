import { useMemo } from 'react'
import { motion, Transition } from 'framer-motion'
import { springs } from '../../lib/motion'
import { useMounted } from '../../hooks/useMounted'

export default function FlyInFromLeft({ 
  _key,
  transition = springs.roll,
  waitForMount,
  x = { start: -8, end: 0 },
  className,
  children 
}: { 
  _key: string,
  transition?: Transition,
  waitForMount?: boolean,
  x?: { start: number, end: number },
  className?: string,
  children: React.ReactNode 
}) {
  const mounted = useMounted()
  const initial = useMemo(() => 
    (!waitForMount || mounted) ? { x: x.start, opacity: 0 } : false, 
  [waitForMount, mounted])
  return <motion.div className={className}
    key={`motion-${_key}`}
    transition={transition}
    initial={initial}
    animate={{ x: x.end, opacity: 1 }} >
    {children}
  </motion.div>
}
