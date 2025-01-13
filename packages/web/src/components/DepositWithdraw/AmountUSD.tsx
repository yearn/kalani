import { useSuspendedParameters } from './useParameters'
import { useVaultAsset } from './useVaultAsset'
import { useMemo } from 'react'
import bmath from '@kalani/lib/bmath'
import { isSomething } from '@kalani/lib/strings'
import { usePrice } from '../../hooks/usePrices'
import Odometer from 'react-odometerjs'

export default function AmountUSD() {
  const { chainId, vault, amount } = useSuspendedParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const expanded = useMemo(() => BigInt(isSomething(amount) ? Number(amount) * 10 ** (asset!.decimals) : 0), [amount, asset])
  const price = usePrice(chainId ?? 0, asset!.address)
  const priced = useMemo(() => bmath.priced(expanded, asset?.decimals ?? 18, price ?? 0), [expanded, asset, price])
  return <div className="flex items-center gap-1">
    <div>$</div>
    <Odometer value={priced} format="(,ddd).dd" />
  </div>
}
