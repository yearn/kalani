import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const borderPrimaryRegex = /([ ]|^)(\w{2}:)?border-primary/

export function cn(...inputs: ClassValue[]) {
  const result = twMerge(clsx(inputs))
  const match = inputs.join(' ').match(borderPrimaryRegex)
  if (match) {
    return `${match[0].trim()} ${result}`
  }
  return result
}
