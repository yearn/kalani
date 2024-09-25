import SetAddress from '../../../../components/SetAddress'
import abis from '@kalani/lib/abis'
import { EvmAddress } from '@kalani/lib/types'
import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export default function SetFeeRecipient({ 
  chainId,
  accountant
}: { 
  chainId: number,
  accountant: EvmAddress 
}) {
  const { address } = useAccount()

  const feeManager = useReadContract({
    chainId,
    address: accountant,
    abi: abis.accountant,
    functionName: 'feeManager'
  })

  const permitted = useMemo(() => {
    return feeManager.data === address
  }, [address, feeManager])

  return <SetAddress 
    verb="Set" 
    permitted={permitted} 
    contract={{
      chainId,
      address: accountant,
      abi: abis.accountant,
      get: 'feeRecipient',
      set: 'setFeeRecipient'
    }} 
  />
}
