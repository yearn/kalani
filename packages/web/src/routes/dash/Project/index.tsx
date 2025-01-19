import { useParams } from 'react-router-dom'
import Hero from '../../../components/Hero'
import { zeroHash } from 'viem'
import { getChain } from '../../../lib/chains'
import { HexStringSchema } from '@kalani/lib/types'
import EvmAddressChipSlide from '../../../components/ChipSlide/EvmAddressChipSlide'
import CopyHashChipSlide from '../../../components/ChipSlide/CopyHashChipSlide'
import { useSuspenseReadProject } from '../../../components/SelectProject/useProjects'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import LabelValueRow from '../../../components/elements/LabelValueRow'
import ViewGeneric from '../../../components/elements/ViewGeneric'
import ChainImg from '../../../components/ChainImg'
import Section from '../../../components/Section'

export function useProjectParams() {
  const params = useParams()
  const chainId = parseInt(params.chainId ?? '0')
  const id = HexStringSchema.parse(params.id) ?? zeroHash
  return { chainId, id }
}

export function useProjectByParams() {
  const { chainId, id } = useProjectParams()
  return useSuspenseReadProject(chainId, id)
}

function Suspender() {
  const { chainId, id } = useProjectParams()
  const { project } = useProjectByParams()

  return <section className="flex flex-col gap-10">
    <Hero className="bg-indigo-400 text-neutral-950">
      <div className="flex flex-col justify-center gap-2 drop-shadow-lg">
        <div className="flex items-center gap-3 text-sm">
          project
        </div>
        <div className="text-5xl font-bold">{project.name}</div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
          </div>
        </div>
      </div>
    </Hero>

    <Section className="mx-8">
      <div className="px-4 py-2 flex flex-col gap-primary">
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

export default function Project() {
  return <Suspense fallback={<Skeleton className="h-48 rounded-primary" />}>
    <Suspender />
  </Suspense>
}
