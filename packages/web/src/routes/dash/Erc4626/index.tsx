import { useVaultFromParams } from '../../../hooks/useVault'
import Vitals from './tabs/Vitals'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import { Suspense } from 'react'
import { VaultHero, VaultHeroSkeleton } from '../Vault'

function Hero() {
  const { vault } = useVaultFromParams()
  if (!vault) return <></>
  return <VaultHero
    name={vault.name}
    chainId={vault.chainId}
    address={vault.address}
    assetAddress={vault.asset.address}
    tvl={vault.tvl?.close}
    apy={vault.apy?.close}
    chip="erc4626"
    inset={<Tabs className="w-full pb-3 pl-2 sm:pl-0">
      <Tab id="vitals" isDefault={true}>Vitals</Tab>
    </Tabs>}
  />
}

export default function Erc4626() {
  return <section className="flex flex-col gap-8">
    <Suspense fallback={<VaultHeroSkeleton />}>
      <Hero />
    </Suspense>

    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    </div>
  </section>
}