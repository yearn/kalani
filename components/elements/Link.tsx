import React, { ReactNode } from 'react'
import _Link, { LinkProps } from 'next/link'
import { AnchorClassName } from './A'

type InputProps = LinkProps & {
  className?: string,
  children: ReactNode,
}

const Link: React.FC<InputProps> = ({ className, children, href, ...props }) => (
  <_Link href={href} className={`
    ${AnchorClassName}
    ${className}`} {...props}>
    {children}
  </_Link>
)

export default Link
