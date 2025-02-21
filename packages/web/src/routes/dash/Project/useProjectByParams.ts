import { useParams } from 'react-router-dom'
import { zeroHash } from 'viem'
import { HexStringSchema } from '@kalani/lib/types'
import { useSuspenseReadProject } from '../../../components/SelectProject/useProjects'

function useProjectParams() {
  const params = useParams()
  const chainId = parseInt(params.chainId ?? '0')
  const id = HexStringSchema.parse(params.id) ?? zeroHash
  return { chainId, id }
}

export function useProjectByParams() {
  const { chainId, id } = useProjectParams()
  return useSuspenseReadProject(chainId, id)
}
