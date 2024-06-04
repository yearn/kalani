import abis from '@/lib/abis'
import SetAddress from '../../../../components/SetAddress'
import { EvmAddress } from '@/lib/types'

export default function SetAccountant({ vault }: { vault: EvmAddress }) {
  return <SetAddress rolemask={8} contract={{
    address: vault,
    abi: abis.vault,
    get: 'accountant',
    set: 'set_accountant'
  }}/>
}
