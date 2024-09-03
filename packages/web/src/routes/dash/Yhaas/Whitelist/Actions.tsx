import { useCallback, useMemo } from 'react'
import Button from '../../../../components/elements/Button'
import { useWhitelist } from './provider'
import { useTargetType } from './useTargetType'
import { useAccount } from 'wagmi'
import { useApplyToWhitelist } from './useApplyToWhitelist'

export default function Actions() {
  const { chainId, address } = useAccount()
  const w = useWhitelist()
  const { data: targetType, name } = useTargetType(w.targetOrUndefined)

  const disabled = useMemo(() => {
    return !(targetType && w.repo && w.frequency)
  }, [w, targetType])

  const onReset = useCallback(() => {
    w.setTarget(undefined)
    w.setRepo(undefined)
    w.setFrequency(undefined)
  }, [w])

  // const apply = useApplyToWhitelist()

  const onApply = useCallback(() => {
  }, [])

  return <div className="flex items-center justify-end gap-6">
    <Button onClick={onReset} h={'secondary'}>Reset</Button>
    <Button onClick={onApply} disabled={disabled}>Apply for Whitelist</Button>
  </div>
}
