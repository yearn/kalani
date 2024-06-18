'use client'

import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useMemo } from 'react'

export default function Bg() {
  const { isAbove2xl } = useBreakpoint('2xl')
  const xmax = isAbove2xl ? 400 : 200
  const ymax = isAbove2xl ? 600 : 300

  const stars = useMemo(() => {
    const result = []
    for (let i = 0; i < 100; i++) {
      result.push({
        x: Math.random() * xmax,
        y: Math.random() * ymax,
        size: Math.random() * 2,
        opacity: Math.random(),
      })
    }
    return result
  }, [xmax, ymax])

  return <div className={`
    fixed z-0 -top-[160px] -left-[160px] size-[2000px] 2xl:size-[2800px]`}>

    <div className={`
      absolute z-0 inset-0 animate-atmospheric-pulse
      bg-secondary-400 blur-3xl rounded-l-full`} />

    {stars.map((star, i) => (
      <div suppressHydrationWarning key={i} style={{
        top: `${160 + star.y}px`,
        left: `${160 + star.x}px`,
        width: `${star.size}px`,
        height: `${star.size}px`,
        opacity: star.opacity,
      }} className={`absolute z-10 bg-white rounded-full`} ></div>
    ))}

    <div className={`
      absolute z-20 inset-0
      bg-primary-1000 border border-secondary-400/10 rounded-l-full`} />

  </div>
}
