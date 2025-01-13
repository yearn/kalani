import { Suspense } from 'react'
import { SkeletonButton } from '../../Skeleton'
import { useAccount } from 'wagmi'
import Connect from '../../Connect'
import CTA from '../../CTA'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import { useSuspendedParameters } from '../useParameters'

function Suspender() {
  const { mode } = useSuspendedParameters()
  return mode === 'deposit' ? <Deposit /> : <Withdraw />
}

export default function Action() {
  const { isConnected } = useAccount()

  if (!isConnected) return <div className="flex items-center justify-end">
    <Connect label={<CTA>Connect</CTA>} />
  </div>

  return <div className="flex items-center justify-end">
    <Suspense fallback={<SkeletonButton>Approve XYZI</SkeletonButton>}>
      <Suspender />
    </Suspense>
  </div>
}
