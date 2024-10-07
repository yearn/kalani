import { cn } from '../lib/shadcn'
import AnimatedGradientText from './magicui/animated-gradient-text'

export default function CTA({ className, children }: { className?: string, children: React.ReactNode }) {
  return <AnimatedGradientText>
    <span className={cn(`
      inline animate-gradient 
      bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 
      bg-[length:var(--bg-size)_100%] 
      bg-clip-text text-transparent`, className)}>
      {children}
    </span>
  </AnimatedGradientText>
}
