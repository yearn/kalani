import SetAddress from '@/components/SetAddress'
import abis from '@/lib/abis'
import { EvmAddress, EvmAddressSchema } from '@/lib/types'
import { useEffect, useState } from 'react'
import { useReadContracts } from 'wagmi'

export default function Manage({ address }: { address: EvmAddress }) {
  const [feeManager, setFeeManager] = useState<EvmAddress | undefined>(undefined)
  const [feeRecipient, setFeeRecipient] = useState<EvmAddress | undefined>(undefined)

  const multicall = useReadContracts({ contracts: [
    { abi: abis.accountant, address, functionName: 'feeManager' },
    { abi: abis.accountant, address, functionName: 'feeRecipient' }
  ] })

  useEffect(() => {
    if (multicall.data?.every(d => d.status === 'success')) {
      setFeeManager(EvmAddressSchema.parse(multicall.data[0].result))
      setFeeRecipient(EvmAddressSchema.parse(multicall.data[1].result))
    }
  }, [multicall])

  return <div>
    <div>Fee Manager</div>
    <div>{feeManager}</div>
    <div>Fee Recipient</div>
    <div>{feeRecipient}</div>
  </div>
}
