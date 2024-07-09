import abis from '@/lib/abis'
import TransferAddress from '@/components/TransferAddress'
import { EvmAddress } from '@/lib/types'
import { useAccount, useReadContract } from 'wagmi'
import { useMemo } from 'react'

export default function TransferFeeManager({
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

  return <TransferAddress 
    transferPermitted={permitted}
    refetchTransferPermitted={feeManager.refetch}
    contract={{
      chainId,
      address: accountant,
      abi: abis.accountant,
      current: 'feeManager',
      propose: 'setFutureFeeManager',
      proposal: 'futureFeeManager',
      accept: 'acceptFeeManager'
    }} 
  />
}
