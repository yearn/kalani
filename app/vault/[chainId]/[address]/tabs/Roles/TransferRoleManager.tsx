import abis from '@/lib/abis'
import SetAddress from '../../../../../../components/SetAddress'
import { EvmAddress, PSEUDO_ROLES } from '@/lib/types'
import { PiStarFill } from 'react-icons/pi'

// export default function TransferRoleManager({ vault }: { vault: EvmAddress }) {
//   return <SetAddress 
//     label={<div className="flex items-center gap-2"><PiStarFill className="fill-primary-300" /><div>Role Manager</div></div>} 
//     verb={'Transfer'}
//     roleMask={PSEUDO_ROLES.ROLE_MANAGER}
//     contract={{
//       address: vault,
//       abi: abis.vault,
//       get: 'role_manager',
//       set: 'transfer_role_manager'
//   }}/>
// }

export default function TransferRoleManager({ vault }: { vault: EvmAddress }) {
  return <SetAddress 
    verb={'Transfer'}
    permitted={true}
    contract={{
      address: vault,
      abi: abis.vault,
      get: 'role_manager',
      set: 'transfer_role_manager'
  }}/>
}
