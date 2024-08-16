'use client'

import { useRouter } from 'next/navigation'
import { Yearn } from './icons/Yearn'
import GlowGroup from './elements/GlowGroup'
import { PiDotsNineBold, PiGithubLogoFill } from 'react-icons/pi'
import { AnchorHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/shadcn'
import Wordmark from './Wordmark'
import Juice from './icons/Juice'
import Image from 'next/image'

type LauncherButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

const LauncherButtonClassName = `
px-6 py-3 flex items-center justify-center
bg-black rounded-primary
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
w-full px-6 py-3
flex items-center justify-center
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
  <a ref={ref} {...props} className={cn(`group/button w-24 flex flex-col items-center justify-center gap-1 text-xs`, LauncherButtonClassName, className)}>{children}</a>
))

LauncherIconButton.displayName = 'LauncherIconButton'

export default function Launcher({
  alignRight
}: {
  alignRight?: boolean
}) {
	const router = useRouter()
  return <div className="isolate relative group">
    <div className="py-4">
      <GlowGroup className="rounded-none">
        <div className={`
          border border-transparent group-hover:border-secondary-50
          group-active:border-secondary-200
          p-2 bg-neutral-950 rounded-none`}>
          <PiDotsNineBold size={24} />
        </div>
      </GlowGroup>
    </div>
    <GlowGroup className={cn(`absolute p-4
      hidden group-hover:flex flex-col gap-4
      border border-transparent group-hover:border-secondary-50
      group-active:border-secondary-200
      bg-neutral-900 text-neutral-400 rounded-primary`, 
      alignRight ? 'right-0' : '')}>
      <LauncherButton href="https://yearn.fi" target="_blank" rel="noreferrer">yearn.fi</LauncherButton>
      <V3Button href="https://yearn.fi/v3" target="_blank" rel="noreferrer">V3</V3Button>
      <div className="flex items-center justify-center gap-4">
        <LauncherIconButton href="https://juiced.yearn.fi/" target="_blank" rel="noreferrer">
          <Juice className="group-hover/button:contrast-200 group-hover/button:grayscale" /> Juiced
        </LauncherIconButton>

        <LauncherIconButton href="https://yearn.fi/vaults" target="_blank" rel="noreferrer">
          <Yearn back="text-[#f472b6] group-hover/button:text-neutral-900" front="text-neutral-200" /> V2
        </LauncherIconButton>
      </div>

      <div className="flex items-center justify-center gap-4">
        <LauncherIconButton href="https://veyfi.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0x41252E8691e964f7DE35156B68493bAb6797a275/logo-128.png" />
          veYFI
        </LauncherIconButton>
        <LauncherIconButton href="https://ycrv.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0xFCc5c47bE19d06BF83eB04298b026F81069ff65b/logo-128.png" />
          yCRV
        </LauncherIconButton>
      </div>

      <div className="flex items-center justify-center gap-4">
        <LauncherIconButton href="https://yeth.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0x1BED97CBC3c24A4fb5C069C6E311a967386131f7/logo-128.png" />
          yETH
        </LauncherIconButton>
        <LauncherIconButton href="https://yprisma.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0xe3668873d944e4a949da05fc8bde419eff543882/logo-128.png" />
          yPrisma
        </LauncherIconButton>
      </div>

      <div className="flex items-center justify-center gap-4">
        <LauncherIconButton href="https://factory.yearn.fi/" target="_blank" rel="noreferrer">
          <Yearn back="text-neutral-800 group-hover/button:text-neutral-900" front="text-neutral-200" />
          yFactory
        </LauncherIconButton>
        <LauncherIconButton href="https://github.com/murderteeth/kalani" target="_blank" rel="noreferrer">
          <PiGithubLogoFill size={32} />
          Github
        </LauncherIconButton>
      </div>
    </GlowGroup>
  </div>
}
