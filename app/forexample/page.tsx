'use client'
import SetAccountant from '@/app/vault/[chainId]/[address]/SetAccountant'
import Button from '@/components/elements/Button'
import SetRoles from '@/app/vault/[chainId]/[address]/SetRoles'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function Page() {
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

  return <main className={`min-h-screen pt-32 pb-48 flex items-center justify-center`}>
    <div className="w-[740px] flex flex-col gap-16">
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
      <SetRoles vault={'0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36'} account={'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'} />
      <SetAccountant vault={'0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36'} />
    </div>
  </main>
}
