import { EvmAddress } from '@/lib/types'
import TransferFeeManager from './TransferFeeManager'
import SetFeeRecipient from './SetFeeRecipient'
import SetVaultManager from './SetVaultManager'
import FieldLabelPair from '@/components/FieldLabelPair'
import Section from '@/components/Section'

export default function Admins({ accountant }: { accountant: EvmAddress }) {
  return <Section>
    <div className="flex flex-col gap-8">
      <FieldLabelPair label="Fee Manager">
        <TransferFeeManager accountant={accountant} />
      </FieldLabelPair>
      <FieldLabelPair label="Fee Recipient">
        <SetFeeRecipient accountant={accountant} />
      </FieldLabelPair>
      <FieldLabelPair label="Vault Manager">
        <SetVaultManager accountant={accountant} />
      </FieldLabelPair>
    </div>
  </Section>
}
