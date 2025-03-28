import { useVaultFromParams } from '../../../hooks/useVault/withVault'
import Vitals from './tabs/Vitals'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import { Suspense } from 'react'
import { VaultHero, VaultHeroSkeleton } from '../Vault'
import { useBreakpoints } from '../../../hooks/useBreakpoints'
import DepositWithdraw from '../../../components/DepositWithdraw'

const tabClassName = `
bg-neutral-950
text-neutral-400
data-[selected=true]:bg-secondary-400
hover:bg-neutral-800
active:bg-neutral-900
`

function Hero() {
  const { sm } = useBreakpoints()
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
      {!sm && <Tab id="deposits" isDefault={true} className={tabClassName}>Deposit</Tab>}
      <Tab id="vitals" isDefault={sm} className={tabClassName}>Vitals</Tab>
    </Tabs>}
  />
}

function WrapperDepositWithdraw() {
  function Suspender() {
    const { vault } = useVaultFromParams()
    if (!vault) return <></>
    return <DepositWithdraw chainId={vault.chainId} vault={vault.address} />
  }

  return <Suspense fallback={<></>}>
    <Suspender />
  </Suspense>
}

export default function Erc4626() {
  const { sm } = useBreakpoints()

  return <section className="flex flex-col">
    <Suspense fallback={<VaultHeroSkeleton />}>
      <Hero />
    </Suspense>

    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      {!sm && <TabContent id="deposits" isDefault={true}><WrapperDepositWithdraw /></TabContent>}
      <TabContent id="vitals" isDefault={sm}><Vitals /></TabContent>
    </div>
  </section>
}