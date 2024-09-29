import { useState, useEffect } from 'react'

const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

export function useBreakpoints() {
  const [breakpoints, setBreakpoints] = useState({
    sm: false,
    md: false,
    lg: false,
    xl: false,
    '2xl': false,
  })

  useEffect(() => {
    const mediaQueries = Object.entries(screens).map(([key, value]) => [
      key, window.matchMedia(`(min-width: ${value})`)
    ])

    const updateBreakpoint = () => {
      const next = Object.fromEntries(
        mediaQueries.map(([key, mq]) => [key, (mq as MediaQueryList).matches])
      )
      setBreakpoints(next)
    }

    updateBreakpoint()
    mediaQueries.forEach(([, mq]) => (mq as MediaQueryList).addEventListener('change', updateBreakpoint))

    return () => {
      mediaQueries.forEach(([, mq]) => (mq as MediaQueryList).removeEventListener('change', updateBreakpoint))
    }
  }, [])

  return breakpoints
}
