import Section from '../../../../../components/Section'
import { useVaultFromParams } from '../../../../../hooks/useVault'
import ViewBps from '../../../../../components/elements/ViewBps'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'
import { useCallback, useMemo, useState } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useAccount } from 'wagmi'
import InputBps from '../../../../../components/elements/InputBps'
import { SetCustomConfig } from './SetCustomConfig'

export default function Fees() {
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const isFeeManager = useMemo(() => compareEvmAddresses(address, accountant.feeManager), [address, accountant])
  const [managementFee, setManagementFee] = useState(vault?.fees?.managementFee ?? 0)
  const [performanceFee, setPerformanceFee] = useState(vault?.fees?.performanceFee ?? 0)

  const onChangeManagementFee = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFee = Number(e.target.value)
    if (newFee < 0 || newFee > 10_000) { return }
    setManagementFee(newFee)
  }, [])

  const onChangePerformanceFee = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newFee = Number(e.target.value)
    if (newFee < 0 || newFee > 10_000) { return }
    setPerformanceFee(newFee)
  }, [])

  if (!vault) return <></>

  return <div className="flex flex-col gap-8">
    <Section>
      <div className="px-4 py-2 flex flex-col gap-primary">
        <LabelValueRow label="Management Fee">
          {!isFeeManager && <ViewBps bps={managementFee} className="bg-neutral-900" />}
          {isFeeManager && <InputBps bps={managementFee} isValid={true} className="w-64" onChange={onChangeManagementFee} />}
        </LabelValueRow>

        <LabelValueRow label="Performance Fee">
          {!isFeeManager && <ViewBps bps={performanceFee} className="bg-neutral-900" />}
          {isFeeManager && <InputBps bps={performanceFee} isValid={true} className="w-64" onChange={onChangePerformanceFee} />}
        </LabelValueRow>

        {!isFeeManager && <div className="mt-4 text-sm text-neutral-400">
          <p>• Management fees are charged continuously on the total assets under management</p>
          <p>• Performance fees are only charged on realized profits</p>
        </div>}

        {isFeeManager && <div className="px-8 pt-6 flex justify-end">
          <SetCustomConfig feeConfig={{
            vault: vault.address,
            managementFee,
            performanceFee,
            refund: 0,
            maxFee: 0,
            maxGain: 0,
            maxLoss: 0
          }} />
        </div>}
      </div>
    </Section>

    <Section>
      <div className="px-4 py-2 flex flex-col gap-primary">
        <LabelValueRow label="Fee Recipient">
          <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.feeRecipient} className="bg-neutral-900" />
        </LabelValueRow>

        <LabelValueRow label="Fee Manager">
          <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.feeManager} className="bg-neutral-900" />
        </LabelValueRow>

        <LabelValueRow label="Accountant">
          <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.address} className="bg-neutral-900" />
        </LabelValueRow>
      </div>
    </Section>
  </div>
}
