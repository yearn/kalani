import React, { AnchorHTMLAttributes, forwardRef } from 'react'

type InputProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

const A = forwardRef<HTMLAnchorElement, InputProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={`
    underline underline-offset-8
    text-pink-100 decoration-pink-100/20
    hover:text-secondary-300 hover:decoration-secondary-300
    active:text-secondary-400 active:decoration-secondary-400
    ${className}`}>{children}</a>
))

A.displayName = 'A'

export default A
