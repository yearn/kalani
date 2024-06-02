import React, { forwardRef, InputHTMLAttributes, useCallback, useState } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} {...props} className={`
    px-6 py-3 text-lg
    bg-neutral-950 border border-neutral-900
    hover:text-violet-300 hover:bg-neutral-950 hover:border-violet-300
    focus:text-violet-400 focus:border-violet-400 focus:bg-neutral-900
    disabled:text-neutral-800 hover:disabled:border-neutral-950 disabled:placeholder-neutral-800
    outline-none focus:ring-0 focus:outline-none
    rounded-primary
  ${className}`} />
})

Input.displayName = 'Input'

export default Input
