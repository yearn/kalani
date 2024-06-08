import abis from '@/lib/abis'
import SetAddress from '../../../../components/SetAddress'
import { EvmAddress, ROLES } from '@/lib/types'

export default function SetAccountant({ vault }: { vault: EvmAddress }) {
  return <SetAddress 
    label={'Accountant'}
    verb={'Set'}
    roleMask={ROLES.ACCOUNTANT_MANAGER}
    contract={{
      address: vault,
      abi: abis.vault,
      get: 'accountant',
      set: 'set_accountant'
  }}/>
}
