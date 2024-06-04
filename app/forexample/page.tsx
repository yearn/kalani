'use client'
import SetAccountant from '@/app/vault/[chainId]/[address]/SetAccountant'
import Button from '@/components/elements/Button'

export default function Page() {
  return <main className={`min-h-screen flex items-center justify-center`}>
    <div className="w-[740px] flex flex-col gap-16">
      {/* <div className="flex items-center gap-6">
        <Button theme={'default'}>default</Button>
        <Button theme={'sim'}>s</Button>
        <Button theme={'sim'} disabled={true}>s</Button>
        <Button theme={'write'}>w</Button>
        <Button theme={'write'} disabled={true}>w</Button>
        <Button theme={'confirm'}>c</Button>
        <Button theme={'confirm'} disabled={true}>c</Button>
      </div> */}
      <SetAccountant vault={'0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36'} />
    </div>
  </main>
}
