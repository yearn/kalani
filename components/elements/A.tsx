import React, { AnchorHTMLAttributes, forwardRef } from 'react'

type InputProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

const A = forwardRef<HTMLAnchorElement, InputProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={`
    decoration-1 decoration-dashed underline underline-offset-8
    text-pink-100 decoration-pink-100/20
    hover:text-neutral-0 hover:decoration-neutral-0
  ${className}`}>{children}</a>
))

A.displayName = 'A'

export default A
