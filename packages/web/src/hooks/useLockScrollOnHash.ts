import { useLocation } from 'react-router-dom'
import { useMemo, useEffect } from 'react'
import { useBreakpoints } from './useBreakpoints'

export function useLockScrollOnHash() {
  const { sm } = useBreakpoints()
  const location = useLocation()
  const hasHash = useMemo(() => location.hash.length > 0, [location.hash])
  useEffect(() => {
    if (sm) { return }
    if (hasHash) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sm, hasHash])
}
