import Input from '../../../../components/elements/Input'
import { useAccount } from 'wagmi'
import Connect from '../../../../components/Connect'
import SetTargetAddresses from './SetTargetAddresses'
import { Suspense } from 'react'
import TargetInfos from './TargetInfos'
import TargetForm from './TargetForm'
import Actions from './Actions'
import { useWhitelist } from './useWhitelist'
import FlyInFromBottom from '../../../../components/motion/FlyInFromBottom'
import StepLabel from '../../../../components/forms/StepLabel'
import CTA from '../../../../components/CTA'

export default function Whitelist() {
  const { address, chain } = useAccount()
  const { targets } = useWhitelist()

  if (!(address && chain)) return <div className="flex gap-4">
    <Connect label={<CTA>Connect your wallet</CTA>} />
  </div>

  return <div className="pb-96 flex flex-col gap-20">
    <div className="flex flex-col">
      <Input value={`Network: ${chain?.name}`} disabled />
      <Input value={`Role manager: ${address}`} disabled />
    </div>

    <div className="flex items-start gap-12">
      <StepLabel step={1} />
      <div className="grow flex flex-col gap-6">
        <p className="text-xl">What address(es) do you want to automate with yHaaS?</p>
        <SetTargetAddresses />
        <Suspense fallback={<div className="flex justify-end text-sm text-neutral-400">Checking...</div>}>
          <TargetInfos />
        </Suspense>
      </div>
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
