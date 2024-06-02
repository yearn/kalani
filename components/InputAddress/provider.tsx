import { EvmAddress } from '@/lib/types'
import { createContext, useContext, useState, ReactNode } from 'react'

interface Context {
  previous: EvmAddress | undefined
  next: string | undefined
  setNext: (next: string | undefined) => void
  isValid: boolean
  setIsValid: (isValid: boolean) => void
}

const context = createContext<Context | undefined>(undefined)

export const useInputAddress = () => {
  const _context = useContext(context)
  if (!_context) { throw new Error('useInputAddress must be used within an InputAddressProvider') }
  return _context
}

export const InputAddressProvider = ({ previous, children }: { previous?: EvmAddress, children: ReactNode }) => {
  const [next, setNext] = useState<string | undefined>(previous)
  const [isValid, setIsValid] = useState(false)
  return (
    <context.Provider value={{ previous, next, setNext, isValid, setIsValid }}>
      {children}
    </context.Provider>
  )
}
