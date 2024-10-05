import { useAccountVaults } from './useAccountVaults'
import { fUSD } from '@kalani/lib/format'
import { EvmAddress } from '@kalani/lib/types'
import Pie from './Pie'
import Tile from './Tile'
import Hero from '../../../components/Hero'
import ChainImg from '../../../components/ChainImg'
import EvmAddressChip from '../../../components/EvmAddressChip'
import { useIsContract } from '../../../hooks/useIsContract'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'

export default function Account({ address }: { address: EvmAddress }) {
  const { chainId: chainIdFromAccount, address: addressFromAccount } = useAccount()
  const isUserWallet = useMemo(() => addressFromAccount === address, [addressFromAccount, address])
  const user = useAccountVaults(address)
  const chainId = user?.vaults[0]?.chainId ?? chainIdFromAccount ?? 1
  const isContract = useIsContract(chainId, address)
  const aum = user?.vaults.reduce((acc, vault) => acc + vault.tvl.close, 0) ?? 0
  const pieData = user?.vaults.map(vault => ({ label: vault.asset.symbol, value: vault.tvl.close })) ?? []
  const title = useMemo(() => isContract ? 'Multisig' : isUserWallet ? 'Your Wallet' : 'EOA', [isContract, isUserWallet])

  if (!address) return <></>

  return <section className="flex flex-col gap-8">
    <Hero className="bg-primary-400 text-primary-950">
      <div className="flex flex-col justify-center gap-2">
        <div className={`text-4xl font-fancy`}>{title}</div>

        <div className="flex items-center gap-12">
          <div className="text-2xl font-bold">
            AUM {fUSD(aum)}
          </div>
          <div className="text-2xl font-bold">
            Vaults {String(user?.vaults.length ?? 0)}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <ChainImg chainId={chainId} size={28} />
          <EvmAddressChip chainId={chainId} address={address} className="bg-primary-950 text-primary-400" />
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
