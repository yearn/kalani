'use client'

import { useRouter } from 'next/navigation'
import { Yearn } from '../icons/Yearn'
import GlowGroup from '../elements/GlowGroup'
import { PiGithubLogoFill } from 'react-icons/pi'
import { AnchorHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/shadcn'
import Wordmark from '../Wordmark'
import Juice from '../icons/Juice'
import Image from 'next/image'

type MenuButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

const MenuButtonClassName = `
px-6 py-3 flex items-center justify-center
bg-black rounded-primary
hover:bg-secondary-100 hover:text-black
active:bg-secondary-500
`

const MenuButton = forwardRef<HTMLAnchorElement, MenuButtonProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={cn(MenuButtonClassName, className)}>{children}</a>
))

MenuButton.displayName = 'MenuButton'

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

const V3Button = forwardRef<HTMLAnchorElement, MenuButtonProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={cn(V3ButtonClassName, className)}>
    <Wordmark className={V3ButtonTextClassName}>{children}</Wordmark>
  </a>
))

V3Button.displayName = 'V3Button'

const MenuIconButton = forwardRef<HTMLAnchorElement, MenuButtonProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={cn(`group/button w-24 flex flex-col items-center justify-center gap-1 text-xs`, MenuButtonClassName, className)}>{children}</a>
))

MenuIconButton.displayName = 'MenuIconButton'

export default function Home() {
	const router = useRouter()
  return <div className="isolate relative group">
    <div className="py-4">
      <GlowGroup className="rounded-full">
        <div onClick={() => router.push('/')} className={`
          border border-transparent group-hover:border-secondary-50
          group-active:border-secondary-100
          p-2 bg-neutral-950 rounded-full cursor-pointer`}>
          <Yearn className="size-8" back="text-transparent" front="text-neutral-200" />
        </div>
      </GlowGroup>
    </div>
    <GlowGroup className={`absolute p-4
      hidden group-hover:flex flex-col gap-4
      border border-transparent group-hover:border-secondary-50
      group-active:border-secondary-100
      bg-neutral-900 text-neutral-400 rounded-primary`}>
      <MenuButton href="https://yearn.fi" target="_blank" rel="noreferrer">yearn.fi</MenuButton>
      <V3Button href="https://yearn.fi/v3" target="_blank" rel="noreferrer">V3</V3Button>
      <div className="flex items-center justify-center gap-4">
        <MenuIconButton href="https://juiced.yearn.fi/" target="_blank" rel="noreferrer">
          <Juice className="group-hover/button:contrast-200 group-hover/button:grayscale" /> Juiced
        </MenuIconButton>

        <MenuIconButton href="https://yearn.fi/vaults" target="_blank" rel="noreferrer">
          <Yearn back="text-[#f472b6] group-hover/button:text-neutral-900" front="text-neutral-200" /> V2
        </MenuIconButton>
      </div>

      <div className="flex items-center justify-center gap-4">
        <MenuIconButton href="https://veyfi.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0x41252E8691e964f7DE35156B68493bAb6797a275/logo-128.png" />
          veYFI
        </MenuIconButton>
        <MenuIconButton href="https://ycrv.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0xFCc5c47bE19d06BF83eB04298b026F81069ff65b/logo-128.png" />
          yCRV
        </MenuIconButton>
      </div>

      <div className="flex items-center justify-center gap-4">
        <MenuIconButton href="https://yeth.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0x1BED97CBC3c24A4fb5C069C6E311a967386131f7/logo-128.png" />
          yETH
        </MenuIconButton>
        <MenuIconButton href="https://yprisma.yearn.fi/" target="_blank" rel="noreferrer">
          <Image className="group-hover/button:contrast-200 group-hover/button:grayscale" width={32} height={32} alt="veYFI" src="https://assets.smold.app/api/token/1/0xe3668873d944e4a949da05fc8bde419eff543882/logo-128.png" />
          yPrisma
        </MenuIconButton>
      </div>

      <div className="flex items-center justify-center gap-4">
        <MenuIconButton href="https://factory.yearn.fi/" target="_blank" rel="noreferrer">
          <Yearn back="text-neutral-800 group-hover/button:text-neutral-900" front="text-neutral-200" />
          yFactory
        </MenuIconButton>
        <MenuIconButton href="https://github.com/murderteeth/kalani" target="_blank" rel="noreferrer">
          <PiGithubLogoFill size={32} />
          Github
        </MenuIconButton>
      </div>
    </GlowGroup>
  </div>
}
