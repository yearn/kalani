import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useWhitelist } from './useWhitelist'
import { useTargetInfos } from './useTargetInfos'
import { API_URL } from '../../../../lib/env'

export function useApplyToWhitelist() {
  const { address, chainId } = useAccount()
  const w = useWhitelist()
  const { targetInfos } = useTargetInfos(w.targets)

  const data = useMemo(() => ({
    chainId,
    manager: address,
    targets: targetInfos,
    frequency: w.frequency,
    repo: w.repo,
    options: w.options
  }), [chainId, address, w])

  return useMutation({
    mutationFn: ({ signature }: { signature: string }) => {
      return fetch(`${API_URL}/api/yhaas/whitelist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, signature })
      })
    }
  })
}
