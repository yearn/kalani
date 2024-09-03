import React, { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link as _Link } from 'react-router-dom'
import { AnchorClassName } from './A'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string,
  className?: string,
  children: ReactNode,
}

const Link: React.FC<LinkProps> = ({ className, children, ...props }) => (
  <_Link {...props} className={`
    ${AnchorClassName}
    ${className}`}>
    {children}
  </_Link>
)

export default Link
