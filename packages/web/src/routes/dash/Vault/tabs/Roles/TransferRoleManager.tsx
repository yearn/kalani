import abis from '../../../../../lib/abis'
import TransferAddress from '../../../../../components/TransferAddress'
import { EvmAddress } from '../../../../../lib/types'
import { useAccount, useReadContract } from 'wagmi'
import { useMemo } from 'react'

export default function TransferRoleManager({ chainId, vault }: { chainId: number, vault: EvmAddress }) {
  const { address } = useAccount()

  const roleManager = useReadContract({
    chainId,
    address: vault,
    abi: abis.vault,
    functionName: 'role_manager'
  })

  const permitted = useMemo(() => {
    return roleManager.data === address
  }, [address, roleManager])

  return <TransferAddress 
    transferPermitted={permitted}
    refetchTransferPermitted={roleManager.refetch}
    contract={{
      chainId,
      address: vault,
      abi: abis.vault,
      current: 'role_manager',
      propose: 'transfer_role_manager',
      proposal: 'future_role_manager',
      accept: 'accept_role_manager'
    }}
  />
}
