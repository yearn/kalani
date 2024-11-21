import { useCallback, useMemo, useState } from 'react'
import Addresses from '../../../../components/elements/Addresses'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { useAccount, useConfig } from 'wagmi'
import abis from '@kalani/lib/abis'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { fEvmAddress } from '@kalani/lib/format'
import { FinderItemSchema } from '../../../../components/Finder/useFinderItems'
import { SelectableVault } from './Allocator'
import { z } from 'zod'
import { useVaultFromParams } from '../../../../hooks/useVault'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { zeroAddress } from 'viem'

const AddressResultSchema = z.object({
  address: EvmAddressSchema,
  isErc4626: z.boolean(),
  isSameAsset: z.boolean(),
  isAlreadyAdded: z.boolean(),
  name: z.string().optional(),
  symbol: z.string().optional(),
  asset: EvmAddressSchema.optional()
})

type AddressResult = z.infer<typeof AddressResultSchema>

function useAddressResults(addresses: EvmAddress[]) {
  const { vault } = useVaultFromParams()
  const config = useConfig()

  const contracts = useMemo(() => addresses.map(address => ([
    { abi: abis.vault, address, functionName: 'name' },
    { abi: abis.vault, address, functionName: 'symbol' },
    { abi: abis.vault, address, functionName: 'asset' },
    { abi: abis.vault, address, functionName: 'convertToShares', args: [0n] }
  ])).flat(), [addresses])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const results = useMemo(() => {
    const results: AddressResult[] = []
    for (let i = 0; i < addresses.length; i++) {
      const slice = query.data.slice(i * 4, (i + 1) * 4)
      const [name, symbol, asset] = slice
      results.push(AddressResultSchema.parse({
        address: addresses[i],
        isErc4626: slice.every((result: any) => result.status === 'success' || !result.error?.message.includes('returned no data')),
        isSameAsset: asset.status === 'success' && compareEvmAddresses(asset.result!.toString(), vault?.asset.address ?? zeroAddress),
        isAlreadyAdded: vault?.strategies.some(strategy => compareEvmAddresses(strategy.address, addresses[i])),
        name: name.status === 'success' ? name.result!.toString() : undefined,
        symbol: symbol.status === 'success' ? symbol.result!.toString() : undefined,
        asset: asset.status === 'success' ? asset.result!.toString() : undefined
      }))
    }
    return results
  }, [addresses, query])

  return { query, results }
}

export default function StrategiesByAddress() {
  const [inputRaw, setInputRaw] = useState('')
  const [targets, setTargets] = useState<EvmAddress[]>([])
  const { results } = useAddressResults(targets)
  const { chainId } = useAccount()

  const onChange = useCallback((addresses: EvmAddress[], isValid: boolean) => {
    if (isValid) {
      setTargets(addresses)
    } else {
      setTargets([])
    }
  }, [setTargets])

  const resultToFinderItem = useCallback((result: AddressResult) => {
    return FinderItemSchema.parse({
      chainId, address: result.address, label: 'erc4626',
      name: result.name,
      symbol: result.symbol,
      strategies: [],
      token: { address: result.asset, name: '', symbol: '' },
      addressIndex: ''
    })
  }, [])

  return <div className="flex flex-col gap-6">
    <div className="text-neutral-400">Find strategy by address</div>
    <Addresses onChange={onChange} next={inputRaw} setNext={setInputRaw} className="w-full" />
    {results.map(result => <div key={result.address} className="w-full">
      {!result.isErc4626 && <div className="w-72 px-2 text-warn-400">
        {fEvmAddress(result.address)} is not an ERC4626 vault!
      </div>}

      {!result.isSameAsset && <div className="w-72 px-2 text-warn-400">
        {fEvmAddress(result.address)} uses a different asset than the vault!
      </div>}

      {result.isAlreadyAdded && <div className="w-72 px-2 text-warn-400"> 
        {fEvmAddress(result.address)} is already added to the vault!
      </div>}

      {result.isErc4626 && result.isSameAsset && !result.isAlreadyAdded && <SelectableVault item={resultToFinderItem(result)} />}

    </div>)}
  </div>
}
