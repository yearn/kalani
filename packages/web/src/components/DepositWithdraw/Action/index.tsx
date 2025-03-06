import { Suspense } from 'react'
import { SkeletonButton } from '../../Skeleton'
import { useAccount } from 'wagmi'
import Connect from '../../Connect'
import CTA from '../../CTA'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import { useSuspendedParameters } from '../useParameters'
import Button from '../../elements/Button'
import { useChainModal } from '@rainbow-me/rainbowkit'

function Suspender() {
  const { mode } = useSuspendedParameters()
  return mode === 'deposit' ? <Deposit /> : <Withdraw />
}

export default function Action({ chainId }: { chainId: number }) {
  const { isConnected, chainId: connectedChainId } = useAccount()
  const { openChainModal } = useChainModal()

  if (!isConnected) return <div className="flex items-center justify-end">
    <Connect label={<CTA>Connect</CTA>} />
  </div>

  if (connectedChainId !== chainId) return <div className="flex items-center justify-end">
    <Button h="secondary" onClick={openChainModal} type="button">
      Change network
    </Button>
  </div>

  return <div className="flex items-center justify-end">
    <Suspense fallback={<SkeletonButton>Approve ****</SkeletonButton>}>
      <Suspender />
    </Suspense>
  </div>
}
