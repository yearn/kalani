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

  return <section className="flex flex-col gap-8">
    <Hero className="bg-indigo-400 text-neutral-950">
      <div className="flex flex-col justify-center gap-2">
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

    <div className="w-full px-12">
    <table className="table-auto w-full border-separate border-spacing-6">
        <tbody>
          <tr>
            <td>Network</td>
            <td className="flex items-center justify-end gap-4">
              {getChain(chainId).name}
            </td>
          </tr>

          <tr>
            <td>Id</td>
            <td className="text-right">
              <CopyHashChipSlide hash={id} className="bg-neutral-800" />
            </td>
          </tr>

          <tr>
            <td>Role manager</td>
            <td className="flex items-center justify-end gap-4">
              <EvmAddressChipSlide chainId={chainId} address={project.roleManager} className="bg-neutral-800" />
            </td>
          </tr>

          <tr>
            <td>Registry</td>
            <td className="flex items-center justify-end gap-4">
              <EvmAddressChipSlide chainId={chainId} address={project.registry} className="bg-neutral-800" />
            </td>
          </tr>

          <tr>
            <td>Accountant</td>
            <td className="flex items-center justify-end gap-4">
              <EvmAddressChipSlide chainId={chainId} address={project.accountant} className="bg-neutral-800" />
            </td>
          </tr>

          <tr>
            <td>Debt allocator</td>
            <td className="flex items-center justify-end gap-4">
              <EvmAddressChipSlide chainId={chainId} address={project.debtAllocator} className="bg-neutral-800" />
            </td>
          </tr>

          <tr>
            <td>Factory</td>
            <td className="flex items-center justify-end gap-4">
              <EvmAddressChipSlide chainId={chainId} address={project.roleManagerFactory} className="bg-neutral-800" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
}

export default function Project() {
  return <Suspense fallback={<Skeleton className="h-48" />}>
    <Suspender />
  </Suspense>
}
