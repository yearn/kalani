import { useMemo } from 'react'
import { motion, Transition } from 'framer-motion'
import { springs } from '../../lib/motion'
import { useMounted } from '../../hooks/useMounted'

export default function FlyInFromLeft({ 
  _key,
  transition = springs.roll,
  waitForMount,
  className,
  children 
}: { 
  _key: string,
  transition?: Transition,
  waitForMount?: boolean,
  className?: string,
  children: React.ReactNode 
}) {
  const mounted = useMounted()
  const initial = useMemo(() => 
    (!waitForMount || mounted) ? { x: -8, opacity: 0 } : false, 
  [waitForMount, mounted])
  return <motion.div className={className}
    key={`motion-${_key}`}
    transition={transition}
    initial={initial}
    animate={{ x: 0, opacity: 1 }} >
    {children}
  </motion.div>
}
