import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  const containsPrimaryBorder = inputs.some(input => typeof input === 'string' && input.includes('border-primary'))
  const result = twMerge(clsx(inputs))
  if (containsPrimaryBorder) return `border-primary ${result}`
  return result
}
