import { cn } from '@/lib/shadcn'
import { useEffect, useRef } from 'react'

export default function RetroGrid({ className }: { className?: string }) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    let start: number | null = null
    let animationFrameId: number

    const animate = (timestamp: number) => {
      if (!start) start = timestamp
      const duration = 360_000
      const y_step = 50
      const progress = (timestamp - start) % duration
      const translateY = (progress / duration) * y_step

      grid.style.transform = `rotateX(35deg) translate3d(0, ${-y_step + translateY}%, 0)`

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return (
    <div
      className={cn(
        "pointer-events-none fixed h-full w-full overflow-hidden opacity-100 [perspective:200px]",
        className,
      )}>
      <div className="absolute inset-0 [transform:rotateX(65deg)]">
        <div ref={gridRef}
          className={cn(
            "will-change-transform",
            "[background-repeat:repeat] [background-size:30px_30px] [height:200vh] [inset:0%_0px] [margin-left:-25%] [transform-origin:100%_0_0] [width:300vw]",
            `[background-image:linear-gradient(to_right,rgb(12,12,12)_2px,transparent_0),linear-gradient(to_bottom,rgb(12,12,12)_2px,transparent_0)]`,
          )}
        />
      </div>
    </div>
  )
}
