import { useContext } from 'react'
import { Breakpoints, BreakpointsContext } from '../components/BreakpointsProvider'

export function useBreakpoints(): Breakpoints {
  const context = useContext(BreakpointsContext)
  if (context === null) { throw new Error('useBreakpoints must be used within a BreakpointsProvider') }
  return context
}
