'use client'

import React, { useId, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PiCopy, PiCheck } from 'react-icons/pi'
import { springs } from '@/lib/motion'
import { useMounted } from '@/hooks/useMounted'

interface CopyProps {
  text: string
  size?: number
}

function Motion({ key, children }: { key: string, children: React.ReactNode }) {
  const mounted = useMounted()
  const initial = useMemo(() => mounted ? { y: 8, opacity: 0 } : false, [mounted])
  return <motion.div key={`motion-${key}`}
    transition={springs.glitch}
    initial={initial}
    animate={{ y: 0, opacity: 1 }} >
    {children}
  </motion.div>
}

const Copy: React.FC<CopyProps> = ({ text, size = 16 }) => {
  const id = useId()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  if (isCopied) return <Motion key={`copied-${id}`}><PiCheck size={size} /></Motion>

  return <Motion key={`ready-${id}`}><PiCopy size={size} onClick={handleCopy} style={{ cursor: 'pointer' }} /></Motion>
}

export default Copy
