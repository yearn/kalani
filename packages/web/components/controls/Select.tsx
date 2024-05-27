import React, { forwardRef, SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  className?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => (
  <select ref={ref} {...props} className={`
    rounded px-4 py-2 
		bg-pink-800/40
		border border-transparent
    hover:border-pink-800
    focus:border-pink-700
    disabled:text-neutral-800 hover:disabled:border-neutral-900 disabled:placeholder-neutral-800
    outline-none focus:ring-0 focus:outline-none
    has-nothingselected:text-neutral-400
    [&>option]:text-pink-900
  ${className}`} />
))

Select.displayName = 'Select'

export default Select
