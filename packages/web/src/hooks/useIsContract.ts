import { useState, useEffect, useMemo } from 'react'
import { createPublicClient, http } from 'viem'
import { EvmAddress } from '@kalani/lib/types'
import { getChain } from '../lib/chains'

export function useIsContract(chainId: number, address: EvmAddress) {
  const chain = getChain(chainId)
  const [isContractAddress, setIsContractAddress] = useState<boolean | null>(null)

  const client = useMemo(() => createPublicClient({ chain, transport: http() }), [chain])

  useEffect(() => {
    const checkAddressType = async () => {
      if (address) {
        try {
          const code = await client.getCode({ address })
          setIsContractAddress(code !== undefined && code !== null && code !== '0x')
        } catch (error) {
          console.error('Error checking contract status:', error)
          setIsContractAddress(null)
        }
      } else {
        setIsContractAddress(null)
      }
    }

    checkAddressType()
  }, [address, client])

  return isContractAddress
}
