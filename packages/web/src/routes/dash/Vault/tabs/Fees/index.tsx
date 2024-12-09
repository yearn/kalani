import Section from '../../../../../components/Section'
import { useVaultFromParams } from '../../../../../hooks/useVault'
import ViewBps from '../../../../../components/elements/ViewBps'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'

function ReadOnly() {
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()

  if (!vault) return null
  return <div className="px-4 py-2 flex flex-col gap-6">
    <h2 className="text-2xl font-bold mb-4">Fee Structure</h2>
    
    <LabelValueRow label="Management Fee">
      <ViewBps bps={vault.fees?.managementFee ?? 0} className="bg-neutral-900" />
    </LabelValueRow>

    <LabelValueRow label="Performance Fee">
      <ViewBps bps={vault.fees?.performanceFee ?? 0} className="bg-neutral-900" />
    </LabelValueRow>

    <LabelValueRow label="Fee Recipient">
      <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.feeRecipient} className="bg-neutral-900" />
    </LabelValueRow>

    <LabelValueRow label="Fee Manager">
      <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.feeManager} className="bg-neutral-900" />
    </LabelValueRow>

    <LabelValueRow label="Accountant">
      <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.address} className="bg-neutral-900" />
    </LabelValueRow>

    <div className="mt-4 text-sm text-neutral-400">
      <p>• Management fees are charged continuously on the total assets under management</p>
      <p>• Performance fees are only charged on realized profits</p>
    </div>
  </div>
}

export default function Fees() {
  return <Section>
    <ReadOnly />
  </Section>
}
