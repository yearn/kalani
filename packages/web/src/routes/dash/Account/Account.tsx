import { useAccountVaults } from './useAccountVaults'
import { fEvmAddress, fNumber } from '../../../lib/format'
import { EvmAddress } from '@kalani/lib/types'
import ValueLabelPair from '../../../components/ValueLabelPair'
import Pie from './Pie'
import Tile from './Tile'
import EvmAddressLayout from '../../../components/EvmAddress'

export default function Account({ address }: { address: EvmAddress }) {
  const user = useAccountVaults(address)
  const chainId = user?.vaults[0]?.chainId
  const aum = user?.vaults.reduce((acc, vault) => acc + vault.tvl.close, 0) ?? 0
  const pieData = user?.vaults.map(vault => ({ label: vault.asset.symbol, value: vault.tvl.close })) ?? []

  if (!address) return <></>

  return <section className={`
    relative w-6xl max-w-6xl mx-auto
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-1/2 h-48 p-4 flex flex-col justify-center gap-2 rounded">
        <div className="flex items-center gap-3 text-sm">
          account
          <EvmAddressLayout chainId={chainId ?? 1} address={address} />
        </div>
        <div className="text-5xl">{fEvmAddress(address)}</div>
        <div className="flex items-center gap-12">
          <ValueLabelPair value={fNumber(aum)} label="aum" className="text-4xl" />
          <ValueLabelPair value={String(user?.vaults.length ?? 0)} label="vaults" className="text-4xl" />
        </div>
      </div>
      <div className={`
        w-1/2 h-48 flex items-center justify-center`}>
        <Pie data={pieData} size={200} />
      </div>
    </div>
    {user?.vaults.map((vault, i) => <Tile key={i} vault={vault} account={address} />)}

    {/* {((user?.vaults.length ?? 0) === 0) && <div className="">
      <div className="flex items-center justify-center size-48 border border-neutral-900 bg-neutral-950 text-neutral-700 rounded-primary">
        Add vault
      </div>
    </div>} */}
  </section>
}
