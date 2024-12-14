import { useVaultFromParams } from '../../../hooks/useVault'
import { fPercent, fUSD } from '@kalani/lib/format'
import Roles from './tabs/Roles'
import Vitals from './tabs/Vitals'
import Allocator from './tabs/Allocator'
import Reports from './tabs/Reports'
import ChainImg from '../../../components/ChainImg'
import HeroElement, { HeroInset, HeroTitle } from '../../../components/Hero'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import TokenImg from '../../../components/TokenImg'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { useAllocator } from './useAllocator'
import Fees from './tabs/Fees'
import { EvmAddress } from '@kalani/lib/types'

export interface VaultHeroProps {
  name: string
  chainId: number
  address: EvmAddress
  assetAddress: EvmAddress
  tvl: number | undefined
  apy: number | undefined
  chip?: React.ReactNode
  inset?: React.ReactNode
}

export function VaultHero({
  name,
  chainId,
  address,
  assetAddress,
  tvl,
  apy,
  chip,
  inset
}: VaultHeroProps) {
  return <HeroElement className="bg-secondary-400 text-neutral-950">
    <div className="w-full flex flex-col justify-center gap-2 pb-3">
      <div className="flex items-center gap-12">
        <div className="text-2xl font-bold">
          TVL {fUSD(tvl ?? 0)}
        </div>
        <div className="text-2xl font-bold">
          APY {fPercent(apy) ?? '-.--%'}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <ChainImg chainId={chainId} size={28} />
        <TokenImg chainId={chainId} address={assetAddress} size={28} bgClassName="bg-neutral-950" />
        {chip}
        <EvmAddressChipSlide chainId={chainId} address={address} className="bg-secondary-400 text-neutral-950" />
      </div>

      <div></div>

      <HeroTitle>{name}</HeroTitle>
    </div>

    <HeroInset className="pb-1">
      {inset}
    </HeroInset>

  </HeroElement>
}

function Hero() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  const projectChip = (
    <div className="px-3 py-1 bg-secondary-400 text-neutral-950 rounded-full">
      {vault.yearn ? 'Yearn Allocator' : `${vault.projectName} Allocator`}
    </div>
  )

  return <VaultHero
    name={vault.name}
    chainId={vault.chainId}
    address={vault.address}
    assetAddress={vault.asset.address}
    tvl={vault.tvl?.close ?? 0}
    apy={vault.apy?.close}
    chip={projectChip}
    inset={<Tabs className="w-full">
      <Tab id="vitals" isDefault={true}>Vitals</Tab>
      {allocator && <Tab id="allocator">Allocator</Tab>}
      <Tab id="fees">Fees</Tab>
      <Tab id="reports">Reports</Tab>
      <Tab id="roles">Roles</Tab>
    </Tabs>}
  />
}

function Content() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  return <div className="w-full px-12">
    <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    {allocator && <TabContent id="allocator"><Allocator /></TabContent>}
    <TabContent id="fees"><Fees /></TabContent>
    <TabContent id="reports"><Reports /></TabContent>
    <TabContent id="roles"><Roles /></TabContent>
  </div>
}

export default function Vault() {
  return <section className="flex flex-col gap-8">
    <Suspense fallback={<Skeleton className="h-48" />}>
      <Hero />
      <Content />
    </Suspense>
  </section>
}
