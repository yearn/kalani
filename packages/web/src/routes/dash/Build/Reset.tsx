import { useCallback } from 'react'
import { useSelectedProject } from '../../../components/SelectProject'
import Button, { ButtonProps } from '../../../components/elements/Button'
import { useNewVault } from './useNewVault'
import { useIndexVault } from './useIndexVault'
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

export default function Reset(props: ButtonProps) {
  const reset = useReset()
  return <Button {...props} onClick={reset} h={'secondary'}>Reset</Button>
}
