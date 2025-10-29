import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useMemo } from 'react'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { parseAbi, zeroAddress } from 'viem'
import { compareEvmAddresses } from '@kalani/lib/strings'

const COLORS = [
  'rgb(250 204 21)', // yellow-400
  'rgb(134 25 143)',  // yellow-800
  'rgb(52 211 153)', // emerald-400
  'rgb(6 95 70)',    // emerald-800
  'rgb(34 211 238)', // cyan-400
  'rgb(21 94 117)',  // cyan-800
  'rgb(96 165 250)', // blue-400
  'rgb(30 64 175)',  // blue-800
  'rgb(244 114 182)', // pink-400
  'rgb(157 23 77)',   // pink-800
]

function useOnChainDefaultQueue(chainId: number, vault: EvmAddress) {
  const config = useConfig()
  const query = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function get_default_queue() external view returns (address[])']),
    chainId: chainId,
    address: vault,
    functionName: 'get_default_queue'
  }))
  const defaultQueue = useMemo(() => query.data.map(a => EvmAddressSchema.parse(a)), [query.data])
  return { ...query, defaultQueue }
}

export function useDefaultQueueComposite() {
  const { vault } = useVaultFromParams()
  const { defaultQueue: onChainDefaultQueue, refetch } = useOnChainDefaultQueue(vault?.chainId ?? 0, vault?.address ?? zeroAddress)

  const defaultQueue = useMemo(() => {
    const unsorted = (vault?.strategies ?? []).filter(a => onChainDefaultQueue.includes(a.address))
    const sorted: EvmAddress[] = onChainDefaultQueue
    return unsorted.sort((a, b) => sorted.indexOf(a.address) - sorted.indexOf(b.address))
  }, [vault, onChainDefaultQueue])

  const colors = useMemo(() => {
    const result: string[] = []
    for (const [index, strategy] of defaultQueue.entries()) {
      // Create a hash from address and index
      const hashInput = `${strategy.address}-${index}`
      const hash = Array.from(hashInput).reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0)

      // Use positive modulo to get a color index
      const colorIndex = ((hash % COLORS.length) + COLORS.length) % COLORS.length
      result[index] = COLORS[colorIndex]
    }
    return result
  }, [defaultQueue])

  return { defaultQueue, colors, refetch }
}

export function useDefaultQueueColor(strategy: EvmAddress) {
  const { defaultQueue, colors } = useDefaultQueueComposite()
  return colors[defaultQueue.findIndex(s => compareEvmAddresses(s.address, strategy))]
}
