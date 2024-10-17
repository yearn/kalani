import { useCallback, useEffect, useState } from 'react'
import Button from '../../components/elements/Button'
import { toast } from 'sonner'
import Addresses from '../../components/elements/Addresses'
import TextGrow from '../../components/elements/TextGrow'
import Dialog, { DialogButton } from '../../components/Dialog'
import ChipSlide from '../../components/ChipSlide'
import Bg from '../lander/Bg'
import SelectErc20 from '../../components/SelectErc20'
import DateOrBlock from '../../components/DateOrBlock'

export default function Eg() {
  const [toaston, setToaston] = useState(false)
  const [resolveToast, setResolveToast] = useState<(() => (value: unknown) => void)>(() => () => {})

  const onToastAndWait = useCallback(() => {
    setToaston(t => !t)
    if (toaston) return
    toast.promise(
      new Promise((resolve) => setResolveToast(() => resolve)),
      {
        loading: `Confirming transaction...`,
        success: () => `Transaction confirmed`,
        action: { label: 'View', onClick: () => {} }
      }
    )
  }, [toaston, setToaston, setResolveToast])

  const onToast = useCallback(() => {
    toast('This is a toast')
  }, [])

  const onWarn = useCallback(() => {
    toast.warning('This is a warning')
  }, [])

  const onError = useCallback(() => {
    toast.error('This is an error')
  }, [])

  useEffect(() => {
    if (!toaston) resolveToast()
  }, [toaston, resolveToast])

  return <div className="min-h-screen pt-32 pb-48 flex items-center justify-center">
    <Bg />
    <section className={`w-full sm:w-[740px] flex flex-col gap-16 p-4 sm:p-0`}>

      <div className="flex items-center gap-12">
        <DateOrBlock timestamp={1714857600} block={18345645} className="bg-neutral-900" />
        <ChipSlide className="bg-neutral-900" slide={<div className="whitespace-nowrap">👋 buenas!</div>}>chip slide</ChipSlide>
      </div>

      <div>
        <SelectErc20 chainId={1} placeholder="Find asset by name or address" onSelect={item => toast(item?.name ?? 'what token?')} />
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Button onClick={onToastAndWait} theme={toaston ? 'confirm' : 'default'}>toast and wait</Button>
        <Button onClick={onToast}>toast</Button>
        <Button onClick={onWarn}>warn</Button>
        <Button onClick={onError}>error</Button>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Button theme={'default'}>d</Button>
        <Button theme={'default'} disabled={true}>d</Button>
        <Button theme={'cta'}>c</Button>
        <Button theme={'cta'} disabled={true}>c</Button>
        <Button theme={'sim'}>s</Button>
        <Button theme={'sim'} disabled={true}>s</Button>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Button theme={'write'}>w</Button>
        <Button theme={'write'} disabled={true}>w</Button>
        <Button theme={'confirm'}>c</Button>
        <Button theme={'confirm'} disabled={true}>c</Button>
      </div>

      <div className="flex items-center gap-6">
        <Addresses placeholder="0x addresses" />
      </div>

      <div className="flex items-center gap-6">
        <TextGrow className="grow w-full" placeholder="text grow" />
      </div>

      <div>
        <DialogButton dialogId="example-dialog">Dialog</DialogButton>
        <Dialog title="Dialog Title" dialogId="example-dialog">
          <p>This is the dialog content.</p>
        </Dialog>
      </div>

    </section>
  </div>
}
