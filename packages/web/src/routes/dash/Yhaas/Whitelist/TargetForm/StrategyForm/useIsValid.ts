import { useMemo } from 'react'
import { useWhitelist } from '../../provider'
import { useTargetType } from '../../useTargetType'
import { useIsRelayed } from './useIsRelayed'
import { useProfitMaxUnlockTime } from './useProfitMaxUnlockTime'

export function useIsValid() {
  const { targetOrUndefined: target, repo, frequency } = useWhitelist()
  const { data: targetType } = useTargetType(target)
  const isRelayed = useIsRelayed()
  const { isWithinGuidelines } = useProfitMaxUnlockTime()

  return useMemo(() => {
    return !(targetType && repo && frequency && isRelayed && isWithinGuidelines)
  }, [targetType, repo, frequency, isRelayed, isWithinGuidelines])
}
