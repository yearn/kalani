import { useConfig } from 'wagmi'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi, zeroAddress } from 'viem'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'

export function useOnChainVitals() {
  const config = useConfig()
  const { vault } = useVaultFromParams()

  const query = useSuspenseQuery(readContractsQueryOptions(config, {
    contracts: [
      {
        abi: parseAbi(['function totalAssets() external view returns (uint256)']),
        chainId: vault?.chainId ?? 0,
        address: vault?.address ?? zeroAddress,
        functionName: 'totalAssets'
      },
      {
        abi: parseAbi(['function totalDebt() external view returns (uint256)']),
        chainId: vault?.chainId ?? 0,
        address: vault?.address ?? zeroAddress,
        functionName: 'totalDebt'
      }
    ]
  }))

  const [totalAssetsResult, totalDebtResult] = query.data
  return {
    ...query,
    totalAssets: totalAssetsResult.result,
    totalDebt: totalDebtResult.result
  }
}
