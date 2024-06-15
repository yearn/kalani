import { EvmAddress } from '@/lib/types'
import TransferFeeManager from './TransferFeeManager'
import SetFeeRecipient from './SetFeeRecipient'

export default function Details({ accountant }: { accountant: EvmAddress }) {
  return <div>
    <div>Fee Manager</div>
    <div><TransferFeeManager accountant={accountant} /></div>
    <div>Fee Recipient</div>
    <div><SetFeeRecipient accountant={accountant} /></div>
  </div>
}
