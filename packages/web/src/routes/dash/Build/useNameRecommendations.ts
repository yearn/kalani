import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'
import { useMemo } from 'react'
import { useVaultFormData } from './useVaultForm'

export function useNameRecommendations() {
  const { selectedProject } = useSelectedProject()
  const { asset, category } = useVaultFormData()
  return useMemo(() => {
    const [first, second] = selectedProject?.name.match(/(^.{1})|[A-Z]/g) ?? []
    const prefix = `${first ?? ''}${second ?? ''}`.toLowerCase()

    return {
      name: `${asset?.symbol}-${category} ${selectedProject?.name}`,
      symbol: `${prefix}${asset?.symbol}-${category}`,
    }
  }, [selectedProject, asset, category])
}
