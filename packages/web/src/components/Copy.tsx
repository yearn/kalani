import React, { useId, useState } from 'react'
import { PiCopy, PiCheck } from 'react-icons/pi'
import FlyInFromBottom from './motion/FlyInFromBottom'
import { springs } from '../lib/motion'

interface CopyProps {
  text: string
  size?: number
}

const Copy: React.FC<CopyProps> = ({ text, size = 16 }) => {
  const id = useId()
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  if (isCopied) return <FlyInFromBottom _key={`copied-${id}`} transition={springs.glitch}><PiCheck size={size} /></FlyInFromBottom>

  return <FlyInFromBottom _key={`ready-${id}`} waitForMount={true}><PiCopy size={size} onClick={handleCopy} style={{ cursor: 'pointer' }} /></FlyInFromBottom>
}

export default Copy
