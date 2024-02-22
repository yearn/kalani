import Scanlines from "./Scanlines";

export default function Screen({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={`
    relative p-4 rounded
    border border-neutral-800
    bg-neutral-900 text-neutral-300
    ${className}`}>
    {children}
    <Scanlines />
  </div>
}
