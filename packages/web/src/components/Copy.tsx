import React, { useId, useState } from 'react'
import { PiCopyBold, PiCheck } from 'react-icons/pi'
import FlyInFromBottom from './motion/FlyInFromBottom'
import { springs } from '../lib/motion'
import { useMounted } from '../hooks/useMounted'

interface CopyProps {
  text: string
  size?: number
}

const className = `
  cursor-pointer
  hover:text-secondary-50
  active:text-secondary-400
`

const Copy: React.FC<CopyProps> = ({ text, size = 16 }) => {
  const mounted = useMounted()
  const id = useId()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  if (isCopied) return <FlyInFromBottom _key={`copied-${id}`} transition={springs.glitch}><PiCheck size={size} /></FlyInFromBottom>

  return <FlyInFromBottom _key={`ready-${id}`} parentMounted={mounted}><PiCopyBold size={size} onClick={handleCopy} className={className} style={{ cursor: 'pointer' }} /></FlyInFromBottom>
}

export default Copy
