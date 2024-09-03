import Input from '../../../../components/elements/Input'
import { useAccount } from 'wagmi'
import Connect from '../../../../components/Connect'
import SetTargetAddress from './SetTargetAddress'
import { Suspense } from 'react'
import TargetType from './TargetType'
import TargetForm from './TargetForm'
import Actions from './Actions'
import { useWhitelist } from './provider'
import FlyInFromBottom from '../../../../components/motion/FlyInFromBottom'

export default function Whitelist() {
  const { address, chain } = useAccount()
  const { target } = useWhitelist()

  if (!(address && chain)) return <div className="flex gap-4">
    <Connect label="Connect your wallet to get started" />
  </div>

  return <div className="pb-96 flex flex-col gap-16">
    <div className="flex flex-col gap-6">
      <p>Let's get started!</p>
      <Input value={`Network: ${chain?.name}`} disabled />
      <Input value={`Role manager: ${address}`} disabled />
    </div>

    <div className="flex flex-col gap-6">
      <p>What address do you want to automate?</p>
      <SetTargetAddress />
      <Suspense fallback={<div className="flex justify-end text-sm text-neutral-400">Checking...</div>}>
        <TargetType />
      </Suspense>
    </div>

    <Suspense>
      <TargetForm />
    </Suspense>

    <Suspense>
      {target && <FlyInFromBottom _key="whitelist-actions">
        <Actions />
      </FlyInFromBottom>}      
    </Suspense>
  </div>
}
