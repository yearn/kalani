import Input from '../../../../components/elements/Input'
import { useAccount } from 'wagmi'
import Connect from '../../../../components/Connect'
import SetTargetAddresses from './SetTargetAddresses'
import { Suspense } from 'react'
import TargetInfos from './TargetInfos'
import TargetForm from './TargetForm'
import Actions from './Actions'
import { useWhitelist } from './provider'
import FlyInFromBottom from '../../../../components/motion/FlyInFromBottom'

export default function Whitelist() {
  const { address, chain } = useAccount()
  const { targets } = useWhitelist()

  if (!(address && chain)) return <div className="flex gap-4">
    <Connect label="Connect your wallet to get started" />
  </div>

  return <div className="pb-96 flex flex-col gap-16">
    <div className="flex flex-col gap-6">
      <p>Let's go!</p>
      <Input value={`Network: ${chain?.name}`} disabled />
      <Input value={`Role manager: ${address}`} disabled />
    </div>

    <div className="flex flex-col gap-6">
      <p>What addresses do you want to automate?</p>
      <SetTargetAddresses />
      <Suspense fallback={<div className="flex justify-end text-sm text-neutral-400">Checking...</div>}>
        <TargetInfos />
      </Suspense>
    </div>

    <Suspense>
      <TargetForm />
    </Suspense>

    <Suspense>
      {targets.length > 0 && <FlyInFromBottom _key="whitelist-actions">
        <Actions />
      </FlyInFromBottom>}      
    </Suspense>
  </div>
}
