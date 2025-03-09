import Section from '../../../../../components/Section'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import ViewBps from '../../../../../components/elements/ViewBps'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useAccount } from 'wagmi'
import InputBps from '../../../../../components/elements/InputBps'
import { SetCustomConfig } from './SetCustomConfig'
import Skeleton from '../../../../../components/Skeleton'
import { useBreakpoints } from '../../../../../hooks/useBreakpoints'
import { AcceptFutureFeeManager } from '../../../Aside/Vault/Fees/AcceptFutureFeeManager'
import ClaimFees from '../../../Aside/Vault/Fees/ClaimFees'

function Suspender() {
  const { address } = useAccount()
  const { vault } = useVaultFromParams()
  const { snapshot: accountant } = useAccountantForVaultFromParams()
  const isFeeManager = useMemo(() => compareEvmAddresses(address, accountant.feeManager), [address, accountant])
  const [managementFee, setManagementFee] = useState(vault?.fees?.managementFee ?? 0)
  const [performanceFee, setPerformanceFee] = useState(vault?.fees?.performanceFee ?? 0)
  const { sm } = useBreakpoints()

  const isFutureFeeManager = useMemo(() => compareEvmAddresses(address, accountant.futureFeeManager), [address, accountant])

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

    {!sm && isFutureFeeManager && <Section>
      <AcceptFutureFeeManager />
    </Section>}

    {!sm && !isFutureFeeManager && <Section>
      <ClaimFees />
    </Section>}

    <Section>
      <div className="px-4 py-2 flex flex-col gap-primary">
        <LabelValueRow label="Management Fee">
          {!isFeeManager && <ViewBps bps={managementFee} />}
          {isFeeManager && <InputBps bps={managementFee} isValid={true} className="w-64" onChange={onChangeManagementFee} />}
        </LabelValueRow>

        <LabelValueRow label="Performance Fee">
          {!isFeeManager && <ViewBps bps={performanceFee} />}
          {isFeeManager && <InputBps bps={performanceFee} isValid={true} className="w-64" onChange={onChangePerformanceFee} />}
        </LabelValueRow>

        {!isFeeManager && <div className="mt-4 text-sm text-neutral-400 flex flex-col gap-2">
          <div>• Management fees are charged continuously on the total assets under management</div>
          <div>• Performance fees are only charged on realized profits</div>
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
          <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.feeRecipient} />
        </LabelValueRow>

        <LabelValueRow label="Fee Manager">
          <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.feeManager} />
        </LabelValueRow>

        <LabelValueRow label="Accountant">
          <EvmAddressChipSlide chainId={accountant.chainId} address={accountant.address} />
        </LabelValueRow>
      </div>
    </Section>
  </div>
}

function _Skeleton() {
  return <div className="flex flex-col gap-8">
    <Section>
      <div className="px-4 py-2 flex flex-col gap-primary">
        <LabelValueRow label="Management Fee">
          <Skeleton className="w-24 h-8 rounded-primary" />
        </LabelValueRow>

        <LabelValueRow label="Performance Fee">
          <Skeleton className="w-24 h-8 rounded-primary" />
        </LabelValueRow>

        <div className="mt-4 text-sm text-neutral-400 flex flex-col gap-2">
          <div>• Management fees are charged continuously on the total assets under management</div>
          <div>• Performance fees are only charged on realized profits</div>
        </div>
      </div>
    </Section>

    <Section>
      <div className="px-4 py-2 flex flex-col gap-primary">
        <LabelValueRow label="Fee Recipient">
          <Skeleton className="w-24 h-8 rounded-primary" />
        </LabelValueRow>

        <LabelValueRow label="Fee Manager">
          <Skeleton className="w-24 h-8 rounded-primary" />
        </LabelValueRow>

        <LabelValueRow label="Accountant">
          <Skeleton className="w-24 h-8 rounded-primary" />
        </LabelValueRow>
      </div>
    </Section>
  </div>
}

export default function Fees() {
  return <div className="flex flex-col gap-8">
    <Suspense fallback={<_Skeleton />}>
      <Suspender />
    </Suspense>
  </div>
}
