import { useCallback, useMemo } from 'react'
import { useSignMessage } from 'wagmi'
import Button from '../../../../../components/elements/Button'
import { useWhitelist } from './useWhitelist'
import { useTargetInfos } from './useTargetInfos'
import { useApplyToWhitelist } from './useApplyToWhitelist'
import { toast } from 'sonner'
import A from '../../../../../components/elements/A'
import { useYhaasIssues } from '../../useYhaasIssues'

export default function Actions() {
  const w = useWhitelist()
  const { targetInfos } = useTargetInfos(w.targets)
  const { refetch: refetchYhaasIssues } = useYhaasIssues()

  const onReset = useCallback(() => {
    w.setTargetsRaw('')
    w.setTargets([])
    w.setRepo(undefined)
    w.setFrequency(undefined)
    w.setOptions({})
  }, [w])

  const apply = useApplyToWhitelist()

  const { signMessageAsync } = useSignMessage()

  const onApply = useCallback(async () => {
    try {
      const contracts = targetInfos.map(target => target.address).join('\n')
      const signature = await signMessageAsync({ message: `I manage these contracts:\n${contracts}` })
      const response = await apply.mutateAsync({ signature })
      if (response.status === 200) {
        refetchYhaasIssues()
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
  }, [apply, signMessageAsync, refetchYhaasIssues, targetInfos])

  const theme = useMemo(() => {
    if (apply.isPending) return 'confirm'
    return 'default'
  }, [apply])

  const disabled = useMemo(() => 
    !(targetInfos.length > 0 && w.frequency && w.isRepoValid)
    || apply.isPending, 
  [w, targetInfos, apply])

  return <div className="w-full mt-8 flex flex-wrap-reverse sm:flex-nowrap items-center justify-end gap-6">
    <Button onClick={onReset} h={'secondary'}>Reset</Button>
    <Button onClick={onApply} theme={theme} disabled={disabled}>Apply for Whitelist</Button>
  </div>
}
