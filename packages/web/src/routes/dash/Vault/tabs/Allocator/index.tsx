import { Suspense, useMemo } from 'react'
import { useVaultFromParams } from '../../../../../hooks/useVault'
import { useAllocator, useMinimumChange } from '../../useAllocator'
import { useAccount } from 'wagmi'
import Section from '../../../../../components/Section'
import Allocations from './Allocations'
import NoStrategies from './NoStrategies'
import Skeleton from '../../../../../components/Skeleton'
import { zeroAddress } from 'viem'
import { useHasRoles } from '../../../../../hooks/useHasRoles'
import { ROLES } from '@kalani/lib/types'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'
import AutoAllocate from './AutoAllocate'
import UpdateDebt from './UpdateDebt'

function Suspender() {
  const { chainId } = useAccount()
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()
  const { minimumChange } = useMinimumChange()
  const authorized = useHasRoles({
    chainId: vault?.chainId ?? 0,
    vault: vault?.address ?? zeroAddress,
    roleMask: ROLES.DEBT_MANAGER
  })

  const content = useMemo(() => {
    if ((chainId === vault?.chainId) && minimumChange < 1 && authorized) { return <p className="text-center text-neutral-600">Set a minimum change greater than 0.</p> }
    if ((vault?.strategies.length ?? 0) > 0) { return <Allocations /> }
    return <NoStrategies />
  }, [minimumChange, vault])

  return <>
    <Section className="relative">
      {content}
    </Section>
    <Section className="relative flex flex-col gap-primary">
      <LabelValueRow label="Allocator">
        <EvmAddressChipSlide chainId={vault?.chainId ?? 0} address={allocator ?? vault?.allocator ?? zeroAddress} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Auto allocate">
        <AutoAllocate />
      </LabelValueRow>

      <LabelValueRow label="Update debts">
        <UpdateDebt />
      </LabelValueRow>
    </Section>
  </>
}

function AllocatorSkeleton() {
  return <div className="flex flex-col gap-8">
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
  </div>
}

export default function Allocator() {
  return <div className="flex flex-col gap-8">
    <Suspense fallback={<AllocatorSkeleton />}>
      <Suspender />
    </Suspense>
  </div>
}
