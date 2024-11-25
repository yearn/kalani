import { Suspense, useMemo } from 'react'
import { useVaultFromParams } from '../../../../../hooks/useVault'
import { useMinimumChange } from '../../useAllocator'
import { useAccount } from 'wagmi'
import Section from '../../../../../components/Section'
import Allocations from './Allocations'
import { SetMinimumChange } from './SetMinimumChange'
import NoStrategies from './NoStrategies'
import Skeleton from '../../../../../components/Skeleton'
import { zeroAddress } from 'viem'
import { useHasRoles } from '../../../../../hooks/useHasRoles'
import { ROLES } from '@kalani/lib/types'

function Suspender() {
  const { chainId } = useAccount()
  const { vault } = useVaultFromParams()
  const { minimumChange } = useMinimumChange()
  const authorized = useHasRoles({
    chainId: vault?.chainId ?? 0,
    vault: vault?.address ?? zeroAddress,
    roleMask: ROLES.DEBT_MANAGER
  })

  return useMemo(() => {
    if ((chainId === vault?.chainId) && minimumChange < 1 && authorized) { return <SetMinimumChange /> }
    if ((vault?.strategies.length ?? 0) > 0) { return <Allocations /> }
    return <NoStrategies />
  }, [minimumChange, vault])
}

export default function Allocator() {
  return <Section className="relative">
    <Suspense fallback={<Skeleton className="absolute inset-0 rounded-primary" />}>
      <Suspender />
    </Suspense>
  </Section>
}
