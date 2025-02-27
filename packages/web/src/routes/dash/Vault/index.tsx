import { useVaultFromParams } from '../../../hooks/useVault'
import { fPercent, fUSD } from '@kalani/lib/format'
import Roles from './tabs/Roles'
import Vitals from './tabs/Vitals'
import Allocator from './tabs/Allocator'
import Reports from './tabs/Reports'
import HeroElement, { HeroInset, HeroTitle } from '../../../components/Hero'
import { Tabs, Tab, TabContent } from '../../../components/Tabs'
import TokenImg from '../../../components/TokenImg'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import { Suspense } from 'react'
import Skeleton, { SkeletonTab } from '../../../components/Skeleton'
import { useAllocator } from './useAllocator'
import Fees from './tabs/Fees'
import { EvmAddress } from '@kalani/lib/types'
import { getChain } from '../../../lib/chains'
import { useBreakpoints } from '../../../hooks/useBreakpoints'
import { cn } from '../../../lib/shadcn'

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
  const { sm } = useBreakpoints()

  return <HeroElement className="bg-secondary-400 text-neutral-950">
    <div className="w-full flex flex-col justify-center gap-2 sm:gap-0 sm:pb-4">

      <div className="flex items-center gap-4 text-xl">
        <div className="mb-1">
          <TokenImg chainId={chainId} address={assetAddress} size={sm ? 64 : 48} showChain={true} bgClassName="border-secondary-400" />
        </div>

        <div className="w-full flex flex-col sm:gap-1">
          <HeroTitle>{name}</HeroTitle>
          <div className="-mt-2 sm:-mt-1 flex items-center sm:gap-3 font-bold">
            <div className="hidden sm:block">{getChain(chainId).name}</div>
            <div className="hidden sm:block">//</div>
            <div>
              <EvmAddressChipSlide chainId={chainId} address={address} className="bg-secondary-400" />
            </div>
            <div className="hidden sm:block">//</div>
            <div className="hidden sm:block">{chip}</div>
          </div>
        </div>
      </div>

      <div className="pl-1 flex items-center gap-12 text-2xl sm:text-4xl sm:tracking-widest font-bold drop-shadow-lg">
        <div className="">
          TVL {fUSD(tvl ?? 0)}
        </div>
        <div className="">
          APY {fPercent(apy) ?? '-.--%'}
        </div>
      </div>
    </div>

    <HeroInset>
      {inset}
    </HeroInset>

  </HeroElement>
}

function Hero() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  if (!vault) return <></>

  const projectChip = vault.yearn ? 'Yearn Allocator' : `${vault.projectName} Allocator`

  return <VaultHero
    name={vault.name}
    chainId={vault.chainId}
    address={vault.address}
    assetAddress={vault.asset.address}
    tvl={vault.tvl?.close ?? 0}
    apy={vault.apy?.close}
    chip={projectChip}
    inset={<Tabs className="w-full pb-3 pl-2 sm:pl-0">
      <Tab id="vitals" isDefault={true}>Vitals</Tab>
      {allocator && <Tab id="allocator">Allocator</Tab>}
      <Tab id="fees">Fees</Tab>
      <Tab id="reports">Reports</Tab>
      <Tab id="roles">Roles</Tab>
    </Tabs>}
  />
}

function Content() {
  return <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
    <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
    <TabContent id="allocator"><Allocator /></TabContent>
    <TabContent id="fees"><Fees /></TabContent>
    <TabContent id="reports"><Reports /></TabContent>
    <TabContent id="roles"><Roles /></TabContent>
  </div>
}

export function VaultHeroSkeleton() {
  const { sm } = useBreakpoints()
  return <HeroElement className="bg-secondary-400 text-neutral-950">
    <div className="w-full flex flex-col justify-center gap-2 sm:pb-4">
      <div className="flex items-center gap-4 text-xl">
        <Skeleton className={cn(sm ? 'w-[68px] h-[64px] rounded-full' : 'w-[58px] h-[48px] rounded-full')} />
        <div className="w-full flex flex-col gap-2 sm:gap-3">
          <Skeleton className="w-64 sm:w-96 h-10 sm:h-12 rounded-primary" />
          <Skeleton className="w-24 sm:w-96 h-4 rounded-primary" />
        </div>
      </div>
      <Skeleton className="w-64 sm:w-96 h-8 pl-1 rounded-primary" />
    </div>

    <HeroInset>
      <Tabs className="w-full pb-3 pl-2 sm:pl-0">
        <SkeletonTab />
        <SkeletonTab />
        <SkeletonTab />
      </Tabs>
    </HeroInset>
  </HeroElement>
}

export default function Vault() {
  return <section className="flex flex-col">
    <Suspense fallback={<VaultHeroSkeleton />}>
      <Hero />
    </Suspense>
    <Content />
  </section>
}
