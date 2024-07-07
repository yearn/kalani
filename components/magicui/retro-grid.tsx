import { cn } from '@/lib/shadcn'

export default function RetroGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none border border-white absolute z-50 h-full w-full overflow-hidden opacity-50 [perspective:200px]",
        className,
      )}
    >
      {/* Grid */}
      <div className="absolute border z-50 inset-0 [transform:rotateX(35deg)]">
        <div
          className={cn(
            "animate-grid",

            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:600vw]",

            // Dark styles
            "[background-image:linear-gradient(to_right,rgba(255,255,255,0.2)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)]",
          )}
        />
      </div>

      {/* Background Gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent to-90% dark:from-black" /> */}
    </div>
  )
}
