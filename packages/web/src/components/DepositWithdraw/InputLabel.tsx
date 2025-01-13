import { useSuspendedParameters } from './useParameters'
import { useVaultAsset } from './useVaultAsset'

export default function InputLabel() {
  const { chainId, vault } = useSuspendedParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  return <div className="text-neutral-500 text-5xl">{asset?.symbol}</div>
}
