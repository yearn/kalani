import { EvmAddress } from '@kalani/lib/types'
import { useQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../../../../../../lib/env'

const QUERY = `query Query($chainId: Int!, $vault: String!) {
  allocator(chainId: $chainId, vault: $vault) { address }
}`

async function fetchAllocator({ chainId, vault }: { chainId: number, vault: EvmAddress }) {
  const response = await fetch(KONG_GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { chainId, vault }
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function useAllocator({ chainId, vault }: { chainId: number, vault: EvmAddress }) {
  const query = useQuery({
    queryKey: ['useAllocator', chainId, vault],
    queryFn: () => fetchAllocator({ chainId, vault })
  })

  return {
    ...query,
    allocator: query.data?.data?.allocator?.address
  }
}
