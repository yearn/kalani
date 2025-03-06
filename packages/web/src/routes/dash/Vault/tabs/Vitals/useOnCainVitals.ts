import { useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi, zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'

export function useOnChainVitals() {
  const config = useConfig()
  const { vault } = useVaultFromParams()
  
  const query = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function totalAssets() external view returns (uint256)']),
    chainId: vault?.chainId ?? 0,
    address: vault?.address ?? zeroAddress,
    functionName: 'totalAssets'
  }))

  return { ...query, totalAssets: query.data }
}
