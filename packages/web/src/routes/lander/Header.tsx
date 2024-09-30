import Connect from '../../components/Connect'
import Launcher from '../../components/Launcher'
import AnimatedGradientText from '../../components/magicui/animated-gradient-text'

function CTA() {
  return <AnimatedGradientText>
    <span className={`
      inline animate-gradient 
      bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-400 
      bg-[length:var(--bg-size)_100%] 
      bg-clip-text text-transparent`}>
      🚀 Get started
    </span>
  </AnimatedGradientText>
}

export default function Header() {
  return <header className="absolute inset-x-0 top-0 z-50 w-full">
    <div className="mx-auto w-full h-20 pr-4 sm:pr-10 flex items-center justify-between">
      <div className="grow flex items-center justify-start gap-12"></div>
      <div className="flex items-center justify-end gap-4">
        <Connect label={<CTA />} />
        <Launcher alignRight={true} />
      </div>
    </div>
  </header>
}
