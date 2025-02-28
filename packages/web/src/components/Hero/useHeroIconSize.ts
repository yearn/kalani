import { useBreakpoints } from '../../hooks/useBreakpoints'

export function useHeroIconSize() {
  const { sm } = useBreakpoints()
  return sm ? 48 : 32
}
