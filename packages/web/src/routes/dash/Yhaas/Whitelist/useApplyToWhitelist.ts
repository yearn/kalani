import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useWhitelist } from './provider'
import { useTargetInfos } from './useTargetInfos'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export function useApplyToWhitelist() {
  const { address, chainId } = useAccount()
  const w = useWhitelist()
  const { targetInfos } = useTargetInfos(w.targets)

  const data = useMemo(() => ({
    chainId,
    manager: address,
    targets: targetInfos,
    frequency: w.frequency,
    repo: w.repo
  }), [chainId, address, w])

  return useMutation({
    mutationFn: ({ signature }: { signature: string }) => {
      return fetch(`${API}/api/yhaas/whitelist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, signature })
      })
    }
  })
}
