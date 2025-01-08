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
      chip="erc4626"
      inset={<Tabs className="mb-2">
        <Tab id="vitals" isDefault={true}>Vitals</Tab>
      </Tabs>}
    />

    <div className="w-full px-8">
      <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    </div>
  </section>
}

export default function Erc4626() {
  return <Suspense fallback={<Skeleton className="h-48 rounded-primary" />}>
    <Suspender />
  </Suspense>
}