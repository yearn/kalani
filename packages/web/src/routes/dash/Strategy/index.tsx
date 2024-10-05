import { useVaultFromParams } from '../../../hooks/useVault'
import { fPercent, fUSD } from '@kalani/lib/format'
import Assets from './tabs/Assets'
import Reports from './tabs/Reports'
import ChainImg from '../../../components/ChainImg'
import Hero, { HeroInset } from '../../../components/Hero'
import TokenImg from '../../../components/TokenImg'
import EvmAddressChip from '../../../components/EvmAddressChip'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'

const tabClassName = `
text-secondary-950
data-[open=true]:border-secondary-950
hover:border-secondary-950
active:border-secondary-950/60 active:text-secondary-950/60`

export default function Strategy() {
  const vault = useVaultFromParams()

  if (!vault) return <></>

  return <section className="flex flex-col gap-8">
    <Hero className="bg-secondary-400 text-secondary-950">
      <div className="flex flex-col justify-center gap-2">
        <div className={`text-4xl font-fancy`}>{vault.name}</div>

        <div className="flex items-center gap-12">
          <div className="text-2xl font-bold">
            TVL {fUSD(vault.tvl.close ?? 0)}
          </div>
          <div className="text-2xl font-bold">
            APY {fPercent(vault.apy?.close ?? NaN)}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <ChainImg chainId={vault.chainId} size={28} />
          <TokenImg chainId={vault.chainId} address={vault.asset.address} size={28} bgClassName="bg-secondary-950" />
          <div className="px-3 py-1 bg-secondary-950 text-secondary-400 rounded-full">yearn strategy</div>
          <EvmAddressChip chainId={vault.chainId} address={vault.address} className="bg-secondary-950 text-secondary-400" />
        </div>

        <div></div>
      </div>

      <HeroInset>
        <Tabs className="flex gap-4">
          <Tab id="assets" isDefault={true} className={tabClassName}>Assets</Tab>
          <Tab id="reports" className={tabClassName}>Reports</Tab>
        </Tabs>
      </HeroInset>
    </Hero>

    <div className="w-full px-12">
      <TabContent id="assets" isDefault={true}><Assets /></TabContent>
      <TabContent id="reports"><Reports /></TabContent>
    </div>
  </section>
}
