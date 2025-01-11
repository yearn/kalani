import { EvmAddress } from '@kalani/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

const YDAEMON = import.meta.env.VITE_PUBLIC_YDAEMON

export default function usePrices(chainId: number, tokens: EvmAddress[]) {
  const request = useMemo(() => 
    `${YDAEMON}/${chainId}/prices/some/${tokens.join(',')}?humanized=true`, 
  [chainId, tokens])

  const fallbackData = tokens.reduce((acc: { [key: EvmAddress]: number }, token) => {
    acc[token] = 0
    return acc
  }, {})

  const query = useSuspenseQuery({
    queryKey: ['ydaemon-prices', chainId, tokens],
    queryFn: () => fetch(request).then(r => r.json())
  })

  return {
    ...query,
    data: query.data ?? fallbackData
  }
}

export function usePrice(chainId: number, token: EvmAddress) {
  const result = usePrices(chainId, [token])
  return useMemo(() => result.data[token] ?? 0, [result.data, token])
}
