import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useWhitelist } from './provider'
import { useTargetType } from './useTargetType'
import { fEvmAddress } from '../../../../lib/format'
import { zeroAddress } from 'viem'

const API = import.meta.env.VITE_API ?? 'http://localhost:3001'

export function useApplyToWhitelist() {
  const { address, chainId } = useAccount()
  const w = useWhitelist()
  const { data: targetType, name } = useTargetType(w.targetOrUndefined)

  const data = useMemo(() => ({
    title: `${name} [${fEvmAddress(w.targetOrUndefined ?? zeroAddress)}] [${fEvmAddress(address ?? zeroAddress)}]`,
    chainId,
    manager: address,
    target: w.targetOrUndefined,
    targetType: targetType,
    name,
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
