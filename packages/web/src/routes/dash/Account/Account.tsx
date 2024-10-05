import { useAccountVaults } from './useAccountVaults'
import { fNumber } from '@kalani/lib/format'
import { EvmAddress } from '@kalani/lib/types'
import ValueLabelPair from '../../../components/ValueLabelPair'
import Pie from './Pie'
import Tile from './Tile'
import EvmAddressLayout from '../../../components/EvmAddress'
import Hero from '../../../components/Hero'

export default function Account({ address }: { address: EvmAddress }) {
  const user = useAccountVaults(address)
  const chainId = user?.vaults[0]?.chainId
  const aum = user?.vaults.reduce((acc, vault) => acc + vault.tvl.close, 0) ?? 0
  const pieData = user?.vaults.map(vault => ({ label: vault.asset.symbol, value: vault.tvl.close })) ?? []

  if (!address) return <></>

  return <section className="flex flex-col gap-8">
    <Hero className="bg-primary-400 text-primary-950">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center gap-3 text-lg font-bold">
          <EvmAddressLayout chainId={chainId ?? 1} address={address} />
        </div>
        <div className="flex items-center gap-12">
          <ValueLabelPair value={fNumber(aum)} label="aum" className="text-4xl" />
          <ValueLabelPair value={String(user?.vaults.length ?? 0)} label="vaults" className="text-4xl" />
        </div>
        <div className="flex">
          <div className="p-2 rounded-full text-xs text-primary-400 bg-neutral-900">account</div>
        </div>
      </div>
      <div className="absolute top-0 right-0 bottom-0 left-1/2 px-12 flex items-center justify-center pointer-events-none">
        <Pie data={pieData} size={160} className={''} />
      </div>
    </Hero>
    <div className="px-6 flex flex-col gap-6">
      {user?.vaults.map((vault, i) => <Tile key={i} vault={vault} account={address} />)}
    </div>
  </section>
}
