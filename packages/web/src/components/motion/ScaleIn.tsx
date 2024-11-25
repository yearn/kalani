import { useMemo } from 'react'
import { motion, Transition } from 'framer-motion'
import { springs } from '../../lib/motion'

export default function ScaleIn({ 
  _key,
  transition = springs.roll,
  parentMounted,
  exit = 0,
  children 
}: { 
  _key: string,
  transition?: Transition,
  parentMounted?: boolean,
  exit?: -1 | 0 | 1,
  children: React.ReactNode 
}) {
  const initial = useMemo(() => 
    (parentMounted === true || parentMounted === undefined) ? { scale: 0, opacity: 0 } : false,
  [parentMounted])
  return <motion.div key={`motion-${_key}`}
    transition={transition}
    initial={initial}
    animate={{ scale: 1, opacity: 1 }} 
    exit={{ scale: (1 - exit) * 1, opacity: (1 - exit) * 1 }}>
    {children}
  </motion.div>
}
