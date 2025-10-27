import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useAllocator, useMinimumChange } from '../../useAllocator'
import { zeroAddress } from 'viem'
import Section from '../../../../../components/Section'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'
import { SetMinimumChange } from '../Allocator/SetMinimumChange'
import AutoAllocate from '../Allocator/AutoAllocate'
import UseDefaultQueue from './UseDefaultQueue'

export function AllocatorPanel() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()
  const { minimumChange } = useMinimumChange()

  return (
    <Section className="relative flex flex-col gap-primary">
      <LabelValueRow label="Allocator">
        <EvmAddressChipSlide chainId={vault?.chainId ?? 0} address={allocator ?? vault?.allocator ?? zeroAddress} className="bg-black" />
      </LabelValueRow>

      <LabelValueRow label="Minimum change" infoKey={minimumChange < 1 ? 'new-vault-min-change' : 'minimum-change'}>
        <SetMinimumChange className="w-80" />
      </LabelValueRow>

      <LabelValueRow label="Use default queue" infoKey="use-default-queue">
        <UseDefaultQueue />
      </LabelValueRow>

      <LabelValueRow label="Auto allocate" infoKey="auto-allocate">
        <AutoAllocate />
      </LabelValueRow>
    </Section>
  )
}
