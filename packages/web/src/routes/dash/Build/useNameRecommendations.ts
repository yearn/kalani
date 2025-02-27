import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'
import { useMemo } from 'react'
import { useVaultFormData } from './useVaultForm'

export function useNameRecommendations() {
  const { selectedProject } = useSelectedProject()
  const { asset, category } = useVaultFormData()
  return useMemo(() => {
    const [first, second] = selectedProject?.name.match(/(^.{1})|[A-Z]/g) ?? []
    const prefix = `${first ?? ''}${second ?? ''}`.toLowerCase()
    const suffix = category === 1 ? '' : `-${category}`

    return {
      name: `${asset?.symbol}${suffix} ${selectedProject?.name}`,
      symbol: `${prefix}${asset?.symbol}${suffix}`,
    }
  }, [selectedProject, asset, category])
}
