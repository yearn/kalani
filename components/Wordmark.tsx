import { fancy } from '@/lib/fancy'

export default function Wordmark({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={`
  text-transparent bg-clip-text bg-clip-text
  bg-gradient-to-r from-neutral-400 from-10% via-neutral-200 via-30% to-[#5a3c34]
  tracking-tighter font-[900] drop-shadow-fancy
  ${fancy.className} ${className}`}>
    {children}
  </div>
}
