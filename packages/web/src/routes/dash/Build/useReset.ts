import { useCallback } from 'react'
import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'
import { useIndexVault } from './useIndexVault'
import { useNewVault } from './useNewVault'
import { useVaultFormData } from './useVaultForm'

export function useReset() {
  const { reset } = useVaultFormData()
  const indexVault = useIndexVault()
  const newVault = useNewVault()
  const { setSelectedProject } = useSelectedProject()
  return useCallback(() => {
    indexVault.mutation.reset()
    newVault.write.reset()
    reset()
    setSelectedProject(undefined)
  }, [indexVault, newVault, reset, setSelectedProject])
}
