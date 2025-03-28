import Section from '../../../../../components/Section'
import { Vault } from '../../../../../hooks/useVault'
import { withVault } from '../../../../../hooks/useVault/withVault'
import { div, mulb } from '@kalani/lib/bmath'
import { fPercent, fTokens, fUSD } from '@kalani/lib/format'
import { Suspense, useMemo } from 'react'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'
import { getChain } from '../../../../../lib/chains'
import ViewDateOrBlock from '../../../../../components/elements/ViewDateOrBlock'
import { useAllocator, useTotalDebtRatio } from '../../useAllocator'
import ViewBps from '../../../../../components/elements/ViewBps'
import ViewGeneric from '../../../../../components/elements/ViewGeneric'
import ChainImg from '../../../../../components/ChainImg'
import TokenImg from '../../../../../components/TokenImg'
import { zeroAddress } from 'viem'
import { useIsRelayed } from '../../../Yhaas/tabs/Apply/TargetForm/VaultForm/useIsRelayed'
import { ROLES } from '@kalani/lib/types'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import { useBreakpoints } from '../../../../../hooks/useBreakpoints'
import Skeleton from '../../../../../components/Skeleton'
import { useOnChainVitals } from './useOnCainVitals'

function VitalsComponent({ vault }: { vault: Vault }) {
  const { totalAssets } = useOnChainVitals()

  const idle = useMemo(() => (totalAssets ?? 0n) - (vault?.totalDebt ?? 0n), [vault, totalAssets])
  const { totalDebtRatio } = useTotalDebtRatio()
  const { allocator } = useAllocator()
  const { sm } = useBreakpoints()

  // const type = vault.yearn ? 'Yearn Allocator' : `${vault.projectName} Allocator`

  const type = useMemo(() => {
    if (vault.yearn) { return 'Yearn Allocator' }
    if (vault.projectName) { return `${vault.projectName} Allocator` }
    return 'Unknown'
  }, [vault])

  const deployed = useMemo(() => {
    if (!totalDebtRatio) { return 0 }
    if (!vault?.totalDebt) { return 0 }
    const totalAllocated = mulb(vault?.totalAssets ?? 0n, Number(totalDebtRatio) / 10_000)
    return Math.floor(Number(div(vault?.totalDebt ?? 0n, totalAllocated)) * 10_000)
  }, [vault, totalDebtRatio])

  const { data: isRelayed } = useIsRelayed({
    vault: vault?.address ?? zeroAddress,
    chainId: vault?.chainId,
    rolemask: ROLES.REPORTING_MANAGER
  })

  return <div className="flex flex-col gap-primary">
    <div className="hidden sm:flex flex-row gap-primary px-8 text-2xl xl:text-4xl">
      <div className="grow p-8 2xl:px-24 flex flex-col items-start justify-between xl:flex-row xl:items-center border-primary border-transparent sm:border-black rounded-primary">
        <div>TVL</div>
        <div>{fUSD(vault.tvl?.close ?? 0)}</div>
      </div>

      <div className="grow p-8 2xl:px-24 flex flex-col items-start justify-between xl:flex-row xl:items-center border-primary border-transparent sm:border-black rounded-primary">
        <div>APY</div>
        <div>{fPercent(vault.apy?.close ?? 0)}</div>
      </div>
    </div>

    <Section>
      <div className="flex flex-col gap-primary">
        <LabelValueRow label="TVL" className="sm:hidden text-3xl">
          <ViewGeneric>{fUSD(vault.tvl?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="APY" className="sm:hidden text-3xl">
          <ViewGeneric>{fPercent(vault.apy?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Type">
          <ViewGeneric className="flex items-center gap-4">
            {type}
          </ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Network">
          <ViewGeneric className="flex items-center gap-4">
            <ChainImg chainId={vault.chainId} size={24} /> {getChain(vault.chainId).name}
          </ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Address">
          <EvmAddressChipSlide chainId={vault.chainId} address={vault.address} className="bg-black" />
        </LabelValueRow>

        <LabelValueRow label="Name">
          <ViewGeneric className="w-[280px] sm:w-auto truncate text-right">{vault.name}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Symbol">
          <ViewGeneric>{vault.symbol}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Asset">
          <div className="flex items-center justify-end gap-4">
            <TokenImg chainId={vault.chainId} address={vault.asset.address} size={24} />
            <EvmAddressChipSlide chainId={vault.chainId} address={vault.asset.address} />
          </div>
        </LabelValueRow>

        <LabelValueRow label="Asset name">
          <ViewGeneric>{vault.asset.name}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Asset symbol">
          <ViewGeneric>{vault.asset.symbol}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Total assets">
          <ViewGeneric className="text-3xl font-bold">{fTokens(totalAssets, vault.asset.decimals, { truncate: !sm })}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="TVL">
          <ViewGeneric>{fUSD(vault.tvl?.close ?? 0)}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Price per share">
          <ViewGeneric>{fTokens(vault.pricePerShare ?? 0n, vault.asset.decimals, { fixed: 6 })}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Allocated">
          <ViewBps bps={totalDebtRatio} />
        </LabelValueRow>

        <LabelValueRow label="Deployed">
          <ViewBps bps={deployed} />
        </LabelValueRow>

        <LabelValueRow label="Idle">
          <ViewGeneric>{fTokens(idle, vault.asset.decimals)}</ViewGeneric>
        </LabelValueRow>

        {vault.v3 && <LabelValueRow label="Deposit limit">
          <ViewGeneric>
            {fTokens(vault.deposit_limit ?? 0n, vault.asset.decimals, { fixed: 0, orInfiniteIfGt: 100_000_000_000_000 })}
          </ViewGeneric>
        </LabelValueRow>}

        <LabelValueRow label="Management fee">
          <ViewBps bps={vault.fees?.managementFee ?? 0} />
        </LabelValueRow>

        <LabelValueRow label="Performance fee">
          <ViewBps bps={vault.fees?.performanceFee ?? 0} />
        </LabelValueRow>

        <LabelValueRow label="Role manager">
          <EvmAddressChipSlide chainId={vault.chainId} address={vault.roleManager ?? zeroAddress} />
        </LabelValueRow>

        <LabelValueRow label="Accountant">
          <EvmAddressChipSlide chainId={vault.chainId} address={vault.accountant ?? zeroAddress} />
        </LabelValueRow>

        <LabelValueRow label="Allocator">
          <EvmAddressChipSlide chainId={vault.chainId} address={allocator ?? vault.allocator ?? zeroAddress} />
        </LabelValueRow>

        <LabelValueRow label="yHaaS automation">
          {isRelayed ? <ViewGeneric className="text-green-400">Enabled</ViewGeneric>
            : <ViewGeneric className="text-warn-400">Disabled</ViewGeneric>}
        </LabelValueRow>

        <LabelValueRow label="Version">
          <ViewGeneric>{vault.apiVersion}</ViewGeneric>
        </LabelValueRow>

        <LabelValueRow label="Inception">
          <ViewDateOrBlock timestamp={vault.inceptTime} block={vault.inceptBlock} />
        </LabelValueRow>
      </div>
    </Section>
  </div>
}

export function VitalsSkeleton() {
  return <Section>
    <div className="flex flex-col gap-primary">
      <LabelValueRow label="Network">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Address">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Name">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Symbol">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Asset">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Asset name">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Asset symbol">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Total assets">
        <Skeleton className="w-24 h-11 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="TVL">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

      <LabelValueRow label="Price per share">
        <Skeleton className="w-24 h-8 rounded-primary" />
      </LabelValueRow>

    </div>
  </Section>
}

const Suspender = withVault(VitalsComponent)

function Vitals() {
  return <Suspense fallback={<VitalsSkeleton />}>
    <Suspender />
  </Suspense>
}

export default Vitals
