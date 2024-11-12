import { useMemo } from 'react'
import { motion, Transition } from 'framer-motion'
import { springs } from '../../lib/motion'
import { useMounted } from '../../hooks/useMounted'
import { cn } from '../../lib/shadcn'

export default function FlyInFromBottom({ 
  _key, 
  transition = springs.roll,
  waitForMount,
  exit = 0,
  className,
  children
}: { 
  _key: string,
  transition?: Transition,
  waitForMount?: boolean,
  exit?: -1 | 0 | 1,
  className?: string,
  children: React.ReactNode
}) {
  const mounted = useMounted()
  const initial = useMemo(() => 
    (!waitForMount || mounted) ? { y: 8, opacity: 0 } : false, 
  [waitForMount, mounted])
  return <motion.div key={`motion-${_key}`}
    transition={transition}
    initial={initial}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: exit * 8, opacity: 1 - Math.abs(exit) }}
    className={cn(className)}>
    {children}
  </motion.div>
}
