import { useAccount } from 'wagmi'
import { Suspense } from 'react'
import Skeleton from '../Skeleton'
import InputLabel from './InputLabel'
import Max from './Max'
import Balance from './Balance'
import AmountUSD from './AmountUSD'
import { Input } from './Input'
import Base from './Base'

export default function InputPanel() {
  const { isConnected } = useAccount()

  return <div className={`relative p-6
    flex flex-col gap-3
    border-primary border-neutral-900 bg-secondary-2000
    hover:text-secondary-50 hover:border-secondary-50
    focus-within:!text-secondary-400 focus-within:!border-secondary-400 focus-within:!bg-black
    active:!text-secondary-400 active:!border-secondary-400 active:!bg-black
    rounded-primary hover:rounded-primary focus-within:rounded-primary saber-glow`}>

    <div className="flex items-center justify-between">
      <div className="flex items-center justify-between">
        <Input mode="in" className="text-5xl" />
        <div className="flex items-center gap-6 invisible">
          <Suspense fallback={<Skeleton className="w-8 h-8 rounded-primary" />}>
            <Base />
          </Suspense>
          <Suspense fallback={<Skeleton className="w-28 h-10 rounded-primary" />}>
            <InputLabel />
          </Suspense>
        </div>
      </div>

      <div className="hidden">
        <Suspense fallback={<Skeleton className="w-28 h-10 rounded-primary" />}>
          <InputLabel />
        </Suspense>
      </div>
    </div>

    <div className="flex items-center justify-between text-neutral-500 text-sm">
      <Suspense fallback={<Skeleton className="w-24 h-8 rounded-primary" />}>
        {isConnected && <AmountUSD />}
        {!isConnected && <>$ 0.00</>}
      </Suspense>
      <div className="flex items-center gap-6">
        <Suspense fallback={<Skeleton className="w-24 h-8 rounded-primary" />}>
          {isConnected && <Balance />}
          {!isConnected && <div>Balance 0</div>}
        </Suspense>
        <Suspense fallback={<Skeleton className="w-16 h-8 rounded-primary" />}>
          <Max className="px-6" />
        </Suspense>
      </div>
    </div>
  </div>
}
