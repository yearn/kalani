'use client'
import SetAccountant from '@/app/vault/[chainId]/[address]/SetAccountant'
import Button from '@/components/elements/Button'
import SetRoles from '@/app/vault/[chainId]/[address]/SetRoles'

export default function Page() {
  return <main className={`min-h-screen pt-32 pb-48 flex items-center justify-center`}>
    <div className="w-[740px] flex flex-col gap-16">
      <div className="flex items-center gap-6">
        <Button theme={'default'}>default</Button>
        <Button theme={'sim'}>s</Button>
        <Button theme={'sim'} disabled={true}>s</Button>
        <Button theme={'write'}>w</Button>
        <Button theme={'write'} disabled={true}>w</Button>
        <Button theme={'confirm'}>c</Button>
        <Button theme={'confirm'} disabled={true}>c</Button>
      </div>
      <SetRoles vault={'0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36'} account={'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'} isRoleManager={true} />
    </div>
  </main>
}
