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
import { SetMinimumChange } from './SetMinimumChange'

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
    if ((chainId === vault?.chainId) && minimumChange < 1 && authorized) { return <p className="text-center text-warn-600">Set a minimum change greater than 0!</p> }
    if ((vault?.strategies.length ?? 0) > 0) { return <Allocations /> }
    return <NoStrategies />
  }, [minimumChange, vault, authorized, chainId])

  return <>
    <Section className="relative">
      {content}
    </Section>

    <Section className="relative flex flex-col gap-primary">
      <LabelValueRow label="Allocator">
        <EvmAddressChipSlide chainId={vault?.chainId ?? 0} address={allocator ?? vault?.allocator ?? zeroAddress} className="bg-neutral-900" />
      </LabelValueRow>

      <LabelValueRow label="Minimum change" infoKey={minimumChange < 1 ? 'new-vault-min-change' : 'minimum-change'}>
        <SetMinimumChange className="w-80" />
      </LabelValueRow>

      <LabelValueRow label="Auto allocate">
        <AutoAllocate />
      </LabelValueRow>

      <LabelValueRow label="">
        <UpdateDebt />
      </LabelValueRow>
    </Section>
  </>
}

function _Skeleton() {
  return <div className="flex flex-col sm:gap-primary">
    <Section className="relative">
      <Skeleton className="w-full h-6 rounded-primary" />
    </Section>
    <Section className="relative flex flex-col gap-primary">
      <LabelValueRow label="Allocator">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>
      <LabelValueRow label="Minimum change">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>
      <LabelValueRow label="Auto allocate">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>
      <LabelValueRow label="">
        <Skeleton className="w-24 h-14 rounded-primary" />
      </LabelValueRow>
    </Section>
  </div>
}

export default function Allocator() {
  return <div className="flex flex-col sm:gap-primary">
    <Suspense fallback={<_Skeleton />}>
      <Suspender />
    </Suspense>
  </div>
}
