import Hero, { HeroInset } from '../../../components/Hero'
import { getChain } from '../../../lib/chains'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import CopyHashChipSlide from '../../../components/ChipSlide/CopyHashChipSlide'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import LabelValueRow from '../../../components/elements/LabelValueRow'
import ViewGeneric from '../../../components/elements/ViewGeneric'
import ChainImg from '../../../components/ChainImg'
import Section from '../../../components/Section'
import { useProjectByParams } from './useProjectByParams'
import { Tab, Tabs } from '../../../components/Tabs'

function Suspender() {
  const { project } = useProjectByParams()
  const { chainId, id } = project

  return <section className="flex flex-col gap-10">
    <Hero className="bg-indigo-400 text-neutral-950">
      <div className="flex flex-col justify-center gap-2 drop-shadow-lg">
        <div className="text-5xl font-bold">{project.name}</div>
      </div>

      <HeroInset>
        <Tabs className="w-full pb-3 pl-2 sm:pl-0">
          <Tab id="vitals" isDefault={true} className="text-black active:text-secondary-400 data-[selected=true]:text-secondary-400">Vitals</Tab>
          <Tab id="vaults" className="text-black active:text-secondary-400 data-[selected=true]:text-secondary-400">Vaults</Tab>
        </Tabs>
      </HeroInset>
    </Hero>

    <Section>
      <div className="flex flex-col gap-primary">
        <LabelValueRow label="Network">
          <ViewGeneric className="flex items-center gap-4">
            <ChainImg chainId={chainId} size={24} /> {getChain(chainId).name}
          </ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Id">
          <CopyHashChipSlide hash={id} className="bg-neutral-900" />
        </LabelValueRow>

        <LabelValueRow label="Role manager">
          <EvmAddressChipSlide chainId={chainId} address={project.roleManager} className="bg-neutral-900" />
        </LabelValueRow>

        <LabelValueRow label="Registry">
          <EvmAddressChipSlide chainId={chainId} address={project.registry} className="bg-neutral-900" />
        </LabelValueRow>

        <LabelValueRow label="Accountant">
          <EvmAddressChipSlide chainId={chainId} address={project.accountant} className="bg-neutral-900" />
        </LabelValueRow>

        <LabelValueRow label="Debt allocator">
          <EvmAddressChipSlide chainId={chainId} address={project.debtAllocator} className="bg-neutral-900" />
        </LabelValueRow>

        <LabelValueRow label="Factory">
          <EvmAddressChipSlide chainId={chainId} address={project.roleManagerFactory} className="bg-neutral-900" />
        </LabelValueRow>
      </div>
    </Section>
  </section>
}

function _Skeleton() {
  return <section className="flex flex-col gap-10">
    <Hero className="bg-indigo-400 text-neutral-950">
      <div className="flex flex-col justify-center gap-2 drop-shadow-lg">
        <div><Skeleton className="w-48 h-12 rounded-primary" /></div>
      </div>

      <HeroInset className="flex gap-4 pb-4">
        <Skeleton className="w-24 h-8 rounded-full" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </HeroInset>
    </Hero>
  </section>
}

export default function Project() {
  return <Suspense fallback={<_Skeleton />}>
    <Suspender />
  </Suspense>
}
