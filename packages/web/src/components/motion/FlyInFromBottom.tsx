import { useMemo } from 'react'
import { motion, Transition } from 'framer-motion'
import { springs } from '../../lib/motion'
import { useMounted } from '../../hooks/useMounted'
import { cn } from '../../lib/shadcn'

export default function FlyInFromBottom({ 
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
    (!waitForMount || mounted) ? { y: 8, opacity: 0 } : false, 
  [waitForMount, mounted])
  return <motion.div key={`motion-${_key}`}
    transition={transition}
    initial={initial}
    animate={{ y: 0, opacity: 1 }}
    className={cn(className)}>
    {children}
  </motion.div>
}
