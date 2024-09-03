import TransferFeeManager from './TransferFeeManager'
import SetFeeRecipient from './SetFeeRecipient'
import SetVaultManager from './SetVaultManager'
import FieldLabelPair from '../../../../components/FieldLabelPair'
import Section from '../../../../components/Section'
import { Accountant, withAccountant } from '../useAccountant'

function Admins({ accountant }: { accountant: Accountant }) {
  return <Section className="w-full">
    <div className="flex flex-col gap-8">
      <FieldLabelPair label="Fee Manager">
        <TransferFeeManager chainId={accountant.chainId} accountant={accountant.address} />
      </FieldLabelPair>
      <FieldLabelPair label="Fee Recipient">
        <SetFeeRecipient chainId={accountant.chainId} accountant={accountant.address} />
      </FieldLabelPair>
      <FieldLabelPair label="Vault Manager">
        <SetVaultManager chainId={accountant.chainId} accountant={accountant.address} />
      </FieldLabelPair>
    </div>
  </Section>
}

export default withAccountant(Admins)
