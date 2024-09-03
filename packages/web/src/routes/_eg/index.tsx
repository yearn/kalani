import { useCallback, useEffect, useState } from 'react'
import Button from '../../components/elements/Button'
import TransferFeeManager from '../dash/Accountant/Admins/TransferFeeManager'
import Bg from '../lander/Bg'
import { toast } from 'sonner'

export default function Eg() {
  const [toaston, setToaston] = useState(false)
  const [resolveToast, setResolveToast] = useState<(() => (value: unknown) => void)>(() => () => {})

  const onClick = useCallback(() => {
    setToaston(t => !t)
    if (toaston) return
    toast.promise(
      new Promise((resolve) => setResolveToast(() => resolve)),
      {
        loading: `Confirming transaction...`,
        success: () => `Transaction confirmed!`,
        action: { label: 'View', onClick: () => {} }
      }
    )
  }, [toaston, setToaston, setResolveToast])

  useEffect(() => {
    if (!toaston) resolveToast()
  }, [toaston, resolveToast])

  return <div className="min-h-screen pt-32 pb-48 flex items-center justify-center">
    <Bg />
    <section className={`
      w-[740px] flex flex-col gap-16`}>

      <TransferFeeManager chainId={137} accountant="0x54483f1592ab0aDea2757Ae0d62e6393361d4CEe" />
      <div>
        <Button onClick={onClick} theme={toaston ? 'confirm' : 'default'}>toast</Button>
      </div>
      <div className="flex items-center gap-6">
        <Button theme={'default'}>default</Button>
        <Button theme={'sim'}>s</Button>
        <Button theme={'sim'} disabled={true}>s</Button>
        <Button theme={'write'}>w</Button>
        <Button theme={'write'} disabled={true}>w</Button>
        <Button theme={'confirm'}>c</Button>
        <Button theme={'confirm'} disabled={true}>c</Button>
      </div>

    </section>
  </div>
}