import { useCallback } from 'react'
import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'
import { useIndexVault } from './useIndexVault'
import { useNewVault } from './useNewVault'
import { useVaultFormData } from './useVaultForm'

export function useReset({ scrollToTop = true }: { scrollToTop?: boolean } = {}) {
  const { reset } = useVaultFormData()
  const indexVault = useIndexVault()
  const newVault = useNewVault()
  const { setSelectedProject } = useSelectedProject()
  return useCallback(() => {
    indexVault.mutation.reset()
    newVault.write.reset()
    reset()
    setSelectedProject(undefined)
    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [scrollToTop, indexVault, newVault, reset, setSelectedProject])
}
