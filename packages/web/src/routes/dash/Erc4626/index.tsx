import { useVaultFromParams } from '../../../hooks/useVault'
import Vitals from './tabs/Vitals'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { VaultHero } from '../Vault'

function Suspender() {
  const { vault } = useVaultFromParams()

  if (!vault) return <></>

  return <section className="flex flex-col gap-8">
    <VaultHero
      name={vault.name}
      chainId={vault.chainId}
      address={vault.address}
      assetAddress={vault.asset.address}
      tvl={vault.tvl?.close}
      apy={vault.apy?.close}
      chip={<div className="px-3 py-1 bg-secondary-400 text-neutral-950 rounded-full">erc4626</div>}
      inset={<Tabs>
        <Tab id="vitals" isDefault={true}>Vitals</Tab>
      </Tabs>}
    />

    <div className="w-full px-12">
      <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    </div>
  </section>
}

export default function Erc4626() {
  return <Suspense fallback={<Skeleton className="h-48" />}>
    <Suspender />
  </Suspense>
}