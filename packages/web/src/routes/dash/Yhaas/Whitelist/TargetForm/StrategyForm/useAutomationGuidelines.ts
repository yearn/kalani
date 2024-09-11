import { useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'

export function useAutomationGuidelines() {
  const { chainId } = useAccount()

  const recommendedFrequency = useMemo(() => {
    if (chainId === 1) return 5
    return 3
  }, [chainId])

  const isWithinGuidelines = useCallback((frequency: number) => {
    return frequency >= recommendedFrequency
  }, [recommendedFrequency])

  const isUnlockWithinGuidelines = useCallback((unlock: number) => {
    return isWithinGuidelines(unlock / 60 / 60 / 24)
  }, [isWithinGuidelines])

  return { recommendedFrequency, isWithinGuidelines, isUnlockWithinGuidelines }
}
