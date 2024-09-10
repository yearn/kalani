import { useCallback, useMemo } from 'react'
import { useSignMessage } from 'wagmi'
import Button from '../../../../components/elements/Button'
import { useWhitelist } from './provider'
import { useTargetType } from './useTargetType'
import { useApplyToWhitelist } from './useApplyToWhitelist'
import { toast } from 'sonner'
import A from '../../../../components/elements/A'

export default function Actions() {
  const w = useWhitelist()
  const { data: targetType } = useTargetType(w.targets[0] || undefined)

  const onReset = useCallback(() => {
    w.setTargets([])
    w.setRepo(undefined)
    w.setFrequency(undefined)
  }, [w])

  const apply = useApplyToWhitelist()

  const { signMessageAsync } = useSignMessage()

  const onApply = useCallback(async () => {
    try {
      const signature = await signMessageAsync({ message: `I manage contract ${w.target}` })
      const response = await apply.mutateAsync({ signature })
      if (response.status === 200) {
        const info = await response.json()
        toast.success(<div className="flex flex-col gap-2">
          <div>yHaaS application submitted!</div>
          <A href={info.html_url} target="_blank">View on GitHub</A>
        </div>)
      } else {
        toast.error((await response.json()).message)
      }
    } catch (error) {
      console.error(error)
    }
  }, [apply, signMessageAsync, w])

  const theme = useMemo(() => {
    if (apply.isPending) return 'confirm'
    return 'default'
  }, [apply])

  const disabled = useMemo(() => 
    !(targetType && w.repo && w.frequency) 
    || apply.isPending, 
  [w, targetType, apply])

  return <div className="flex items-center justify-end gap-6">
    <Button onClick={onReset} h={'secondary'}>Reset</Button>
    <Button onClick={onApply} theme={theme} disabled={disabled}>Apply for Whitelist</Button>
  </div>
}
