import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const borderPrimaryRegex = /(^|\s)(\w{2}:)?border(-\w)?-primary/

export function cn(...inputs: ClassValue[]) {
  const result = twMerge(clsx(inputs))
  const match = inputs.join(' ').match(borderPrimaryRegex)
  if (match) { return `${match[0].trim()} ${result}` }
  return result
}
