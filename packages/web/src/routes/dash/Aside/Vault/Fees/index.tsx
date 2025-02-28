import { useVaultFromParams } from '../../../../../hooks/useVault'
import { useMounted } from '../../../../../hooks/useMounted'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { AcceptFutureFeeManager } from './AcceptFutureFeeManager'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import ClaimFees from './ClaimFees'

export default function Fees() {
  const mounted = useMounted()
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()

  const isFutureFeeManager = useMemo(() => compareEvmAddresses(address, accountant.futureFeeManager), [address, accountant])

  if (!vault) return <></>

  return <FlyInFromBottom _key="aside-fees" parentMounted={mounted} exit={1} className="flex flex-col gap-12 w-full">
    {isFutureFeeManager && <AcceptFutureFeeManager />}
    {!isFutureFeeManager && <ClaimFees />}
  </FlyInFromBottom>
}
