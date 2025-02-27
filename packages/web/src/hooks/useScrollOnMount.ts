import { useCallback } from 'react'

export function useScrollOnMount(enabled?: boolean, offset: number = 0) {
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node && enabled) {
      setTimeout(() => {
        const rect = node.getBoundingClientRect()
        const scrollPosition = window.scrollY + rect.top - offset
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        })
      }, 0)
    }
  }, [enabled, offset])

  return ref
}
