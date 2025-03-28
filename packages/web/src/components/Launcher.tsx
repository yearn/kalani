import { Yearn } from '../assets/icons/Yearn'
import { PiDotsNineBold, PiGithubLogoFill } from 'react-icons/pi'
import { AnchorHTMLAttributes, forwardRef } from 'react'
import { cn } from '../lib/shadcn'
import Wordmark from './Wordmark'
import Juice from '../assets/icons/Juiced'
import { useHashNav } from '../hooks/useHashNav'

type LauncherButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

const LauncherButtonClassName = `
px-6 py-6 sm:py-3 flex items-center justify-center
text-2xl sm:text-base bg-black rounded-primary
hover:bg-secondary-200 hover:text-black
active:bg-secondary-500
`

const LauncherButton = forwardRef<HTMLAnchorElement, LauncherButtonProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={cn(LauncherButtonClassName, className)}>{children}</a>
))

LauncherButton.displayName = 'LauncherButton'

const V3ButtonClassName = `group
flex items-center justify-center
text-transparent bg-gradient-to-r from-black to-black
hover:from-pink-500 hover:to-blue-500
rounded-primary
`

const V3ButtonTextClassName = `
w-full px-6 py-6 sm:py-3
flex items-center justify-center
text-2xl sm:text-base
bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500
hover:bg-clip-border hover:text-black
rounded-primary
`

const V3Button = forwardRef<HTMLAnchorElement, LauncherButtonProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={cn(V3ButtonClassName, className)}>
    <Wordmark className={V3ButtonTextClassName}>{children}</Wordmark>
  </a>
))

V3Button.displayName = 'V3Button'

const LauncherIconButton = forwardRef<HTMLAnchorElement, LauncherButtonProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={cn('group/button w-1/2 sm:w-24 flex flex-col items-center justify-center gap-1 text-xs', LauncherButtonClassName, className)}>{children}</a>
))

LauncherIconButton.displayName = 'LauncherIconButton'

export default function Launcher({
  alignRight,
  hideToggle
}: {
  alignRight?: boolean
  hideToggle?: boolean
}) {
  const nav = useHashNav('launcher')
  return <div className="relative group pointer-events-auto">
    {!hideToggle && <div className="py-4">
      <div onClick={nav.toggle} className={`
        border-0 sm:border-primary border-transparent group-hover:border-secondary-50
        group-active:border-secondary-400
        p-2 bg-black rounded-primary saber-glow`}>
        <PiDotsNineBold size={24} />
      </div>
    </div>}
    <div data-open={nav.isOpen} className={cn(`fixed inset-0 sm:absolute sm:inset-auto sm:-right-2 p-4
      hidden data-[open=true]:flex sm:data-[open=true]:hidden sm:group-hover:flex flex-col gap-4
      border-0 sm:border-primary border-transparent group-hover:border-secondary-50
      group-active:border-secondary-400
      bg-secondary-1000 text-neutral-400 rounded-none sm:rounded-primary saber-glow overflow-y-auto`,
      alignRight ? 'right-0' : '')}>
      <div className="grow flex flex-col gap-4">
        <LauncherButton className="grow sm:grow-0 text-secondary-400" href="https://yearn.fi" target="_blank" rel="noreferrer">
          yearn.fi
        </LauncherButton>
        <V3Button className="grow sm:grow-0" href="https://yearn.fi/v3" target="_blank" rel="noreferrer">V3</V3Button>
      </div>
      <div className="contents">
        <div className="flex items-center justify-center gap-4">
          <LauncherIconButton href="https://ycrv.yearn.fi/" target="_blank" rel="noreferrer">
            <img className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0xFCc5c47bE19d06BF83eB04298b026F81069ff65b/logo-128.png" />
            yCRV
          </LauncherIconButton>

          <LauncherIconButton href="https://yearn.fi/vaults" target="_blank" rel="noreferrer">
            <Yearn back="text-[#f472b6] group-hover/button:text-neutral-900" front="text-neutral-200" /> V2
          </LauncherIconButton>
        </div>

        <div className="flex items-center justify-center gap-4">
          <LauncherIconButton href="https://yeth.yearn.fi/" target="_blank" rel="noreferrer">
            <img className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="yETH" src="https://assets.smold.app/api/token/1/0x1BED97CBC3c24A4fb5C069C6E311a967386131f7/logo-128.png" />
            yETH
          </LauncherIconButton>
          <LauncherIconButton href="https://resupply.fi/" target="_blank" rel="noreferrer">
            <img className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="Resupply" src="/public/resupply.png" />
            Resupply
          </LauncherIconButton>
        </div>

        <div className="flex items-center justify-center gap-4">
          <LauncherIconButton href="https://veyfi.yearn.fi/" target="_blank" rel="noreferrer">
            <img className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0x41252E8691e964f7DE35156B68493bAb6797a275/logo-128.png" />
            veYFI
          </LauncherIconButton>

          <LauncherIconButton href="https://bearn.sucks/" target="_blank" rel="noreferrer">
            <img className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="Bearn" src="/public/bearn.png" />
            Bearn
          </LauncherIconButton>
        </div>

        <div className="flex items-center justify-center gap-4">
          <LauncherIconButton href="https://factory.yearn.fi/" target="_blank" rel="noreferrer">
            <Yearn back="text-neutral-800 group-hover/button:text-neutral-900" front="text-neutral-200" />
            yFactory
          </LauncherIconButton>
          <LauncherIconButton href="https://github.com/yearn/kalani" target="_blank" rel="noreferrer">
            <PiGithubLogoFill size={32} />
            Github
          </LauncherIconButton>
        </div>
      </div>
    </div>
  </div>
}
