import ChainImg from '../../../../components/ChainImg'
import CopyHashChipSlide from '../../../../components/ChipSlide/CopyHashChipSlide'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import LabelValueRow from '../../../../components/elements/LabelValueRow'
import ViewGeneric from '../../../../components/elements/ViewGeneric'
import Section from '../../../../components/Section'
import { getChain } from '../../../../lib/chains'
import { useProjectByParams } from '../useProjectByParams'

export default function Vitals() {
  const { project } = useProjectByParams()
  const { chainId, id } = project

  return <Section>
    <div className="flex flex-col gap-primary">
      <LabelValueRow label="Network">
        <ViewGeneric className="flex items-center gap-4">
          <ChainImg chainId={chainId} size={24} /> {getChain(chainId).name}
        </ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Id">
        <CopyHashChipSlide hash={id} />
      </LabelValueRow>

      <LabelValueRow label="Role manager">
        <EvmAddressChipSlide chainId={chainId} address={project.roleManager} />
      </LabelValueRow>

      <LabelValueRow label="Registry">
        <EvmAddressChipSlide chainId={chainId} address={project.registry} />
      </LabelValueRow>

      <LabelValueRow label="Accountant">
        <EvmAddressChipSlide chainId={chainId} address={project.accountant} />
      </LabelValueRow>

      <LabelValueRow label="Debt allocator">
        <EvmAddressChipSlide chainId={chainId} address={project.debtAllocator} />
      </LabelValueRow>

      <LabelValueRow label="Factory">
        <EvmAddressChipSlide chainId={chainId} address={project.roleManagerFactory} />
      </LabelValueRow>
    </div>
  </Section>
}
