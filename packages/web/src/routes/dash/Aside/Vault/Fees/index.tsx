import { useVaultFromParams } from '../../../../../hooks/useVault'
import { useMounted } from '../../../../../hooks/useMounted'
import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useAccount } from 'wagmi'
import { useEffect, useMemo } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { AcceptFutureFeeManager } from './AcceptFutureFeeManager'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import ClaimFees from './ClaimFees'
import { useMenuBar } from '../../../../../components/MenuBar/useMenuBar'

export default function Fees() {
  const mounted = useMounted()
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const { setTheme } = useMenuBar()

  const isFutureFeeManager = useMemo(() => compareEvmAddresses(address, accountant.futureFeeManager), [address, accountant])

  useEffect(() => {
    setTheme(isFutureFeeManager ? 'warn' : 'default')
    return () => setTheme('default')
  }, [isFutureFeeManager, setTheme])

  if (!vault) return <></>

  return <FlyInFromBottom _key="aside-fees" parentMounted={mounted} exit={1} className="flex flex-col gap-12 w-full">
    {isFutureFeeManager && <AcceptFutureFeeManager />}
    {!isFutureFeeManager && <ClaimFees />}
  </FlyInFromBottom>
}
