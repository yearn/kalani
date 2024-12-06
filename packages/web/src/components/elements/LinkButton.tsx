import React, { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link as _Link } from 'react-router-dom'
import { Hierarchy } from './Button'
import { ThemeName } from './Button'
import { cn } from '../../lib/shadcn'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string,
  className?: string,
  theme?: ThemeName
  h?: Hierarchy
  children: ReactNode,
}

const LinkButton: React.FC<LinkProps> = ({ className, theme, h, children, ...props }) => {
  const bg = h === 'secondary' ? 'bg-neutral-950' : h === 'tertiary' ? 'bg-neutral-950 active:bg-black' : 'bg-primary-1000'
  const text = h === 'secondary' ? 'text-neutral-300' : 'text-neutral-0'
  const border = h === 'secondary' ? 'border-neutral-800' : h === 'tertiary' ? 'border-transparent' : 'border-transparent'

  return <_Link {...props} className={cn(`group
    relative h-8 px-8 py-5 flex items-center justify-center
    border-primary ${border} ${bg} text-lg ${text}
    hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
    active:text-secondary-400 active:border-secondary-400
    disabled:bg-neutral-950 disabled:text-neutral-600 
    disabled:hover:border-primary-950 disabled:hover:text-primary-950
    disabled:hover:bg-neutral-950
    disabled:cursor-default disabled:border-transparent
    cursor-pointer rounded-primary whitespace-nowrap
    saber-glow
    ${`theme-${theme ?? 'default'}`}
    ${className}`)}>
    {children}
  </_Link>
}

export default LinkButton
