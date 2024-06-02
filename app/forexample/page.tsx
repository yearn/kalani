'use client'
import Button from '@/components/elements/Button'
import SetAddress from './SetAddress'

export default function Page() {
  return <main className={`min-h-screen flex items-center justify-center`}>
    <div className="w-[600px] flex flex-col gap-16">
      <div className="flex items-center gap-8">
        <Button theme={'default'}>default</Button>
        <Button theme={'sim'}>sim</Button>
        <Button theme={'sim'} disabled={true}>sim disabled</Button>
      </div>
      <SetAddress previous={'0xC4ad0000E223E398DC329235e6C497Db5470B626'} />
    </div>
  </main>
}
