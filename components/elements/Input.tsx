import React, { forwardRef, InputHTMLAttributes, useCallback, useState } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  theme?: 'default' | 'sim' | 'write' | 'confirm'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, theme, ...props }, ref) => {
  return <div className={`rounded-primary ${className} theme-${theme ?? 'default'}`}>
    <input ref={ref} {...props} className={`
      relative w-full px-6 py-3 text-lg
      bg-neutral-950 border border-neutral-800
      hover:text-violet-300 hover:bg-neutral-950 hover:border-violet-300
      focus:text-violet-400 focus:border-violet-400 focus:bg-neutral-900
      disabled:text-neutral-800 disabled:bg-transparent hover:disabled:border-neutral-950 
      disabled:placeholder-neutral-800 disabled:border-transparent
      outline-none focus:ring-0 focus:outline-none
      rounded-primary`} />
  </div>
})

Input.displayName = 'Input'

export default Input
