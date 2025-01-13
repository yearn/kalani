import { cn } from '../../lib/shadcn'
import { PiArrowsDownUpFill } from 'react-icons/pi'

export default function Base({ className }: { className?: string }) {
  return <button type="button" className={cn(`
    p-1 flex items-center 
    text-neutral-500 bg-neutral-900 border-primary border-neutral-900
    hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
    active:text-secondary-400 active:border-secondary-400 active:bg-black
    rounded-full cursor-pointer pointer-events-auto`, className)}>
    <PiArrowsDownUpFill size={20} />
  </button>
}
