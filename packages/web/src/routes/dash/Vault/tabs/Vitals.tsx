import Section from '../../../../components/Section'
import { Vault, withVault } from '../../../../hooks/useVault'
import { div, mulb } from '@kalani/lib/bmath'
import { fBps, fPercent, fTokens, fUSD } from '@kalani/lib/format'
import { useMemo } from 'react'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import { getChain } from '../../../../lib/chains'
import ViewDateOrBlock from '../../../../components/elements/ViewDateOrBlock'
import { useVaultConfig } from '../useAllocator'
import ViewBps from '../../../../components/elements/ViewBps'
import ViewGeneric from '../../../../components/elements/ViewGeneric'
import ChainImg from '../../../../components/ChainImg'
import TokenImg from '../../../../components/TokenImg'
import { zeroAddress } from 'viem'
import { Switch } from '../../../../components/shadcn/switch'

function Vitals({ vault }: { vault: Vault }) {
  const idle = useMemo(() => (vault?.totalAssets ?? 0n) - (vault?.totalDebt ?? 0n), [vault])
  const { vaultConfig } = useVaultConfig()
  const totalDebtRatio = useMemo(() => vaultConfig.totalDebtRatio, [vaultConfig])
  const deployed = useMemo(() => {
    if (!totalDebtRatio) { return 0 }
    if (!vault?.totalDebt) { return 0 }
    const totalAllocated = mulb(vault?.totalAssets ?? 0n, totalDebtRatio / 10_000)
    return Math.floor(Number(div(vault?.totalDebt ?? 0n, totalAllocated)) * 10_000)
  }, [vault, totalDebtRatio])

  return <Section className="w-full p-4">
    <table className="table-auto w-full border-separate border-spacing-6">
      <tbody>
        <tr>
          <td>Network</td>
          <td className="flex justify-end">
            <ViewGeneric className="flex items-center gap-4">
              <ChainImg chainId={vault.chainId} size={24} /> {getChain(vault.chainId).name}
            </ViewGeneric>
          </td>
        </tr>
        <tr>
          <td>Address</td>
          <td className="flex justify-end">
            <EvmAddressChipSlide chainId={vault.chainId} address={vault.address} className="bg-neutral-900" />
          </td>
        </tr>
        <tr>
          <td>Asset</td>
          <td className="flex items-center justify-end gap-4">
            <TokenImg chainId={vault.chainId} address={vault.asset.address} size={24} bgClassName="bg-neutral-900" />
            <EvmAddressChipSlide chainId={vault.chainId} address={vault.asset.address} className="bg-neutral-900" />
          </td>
        </tr>
        <tr>
          <td>Asset name</td>
          <td className="flex items-center justify-end gap-4">
            <ViewGeneric>{vault.asset.name} ({vault.asset.symbol})</ViewGeneric>
          </td>
        </tr>

        <tr>
          <td className="text-xl">Total assets</td>
          <td className="flex justify-end">
            <ViewGeneric className="text-3xl font-bold">
              {fTokens(vault.totalAssets, vault.asset.decimals)}
            </ViewGeneric>
          </td>
        </tr>

        <tr>
          <td>TVL</td>
          <td className="flex justify-end">
            <ViewGeneric>{fUSD(vault.tvl?.close ?? 0)}</ViewGeneric>
          </td>
        </tr>

        <tr>
          <td>Allocated</td>
          <td className="flex justify-end">
            <ViewBps bps={totalDebtRatio} className="bg-neutral-900" />
          </td>
        </tr>

        <tr>
          <td>Deployed</td>
          <td className="flex justify-end">
            <ViewBps bps={deployed} className="bg-neutral-900" />
          </td>
        </tr>

        <tr>
          <td>Idle assets</td>
          <td className="flex justify-end">
            <ViewGeneric>{fTokens(idle, vault.asset.decimals)}</ViewGeneric>
          </td>
        </tr>

        {vault.v3 && <tr>
          <td>Deposit limit</td>
          <td className="flex justify-end">
            <ViewGeneric>
              {fTokens(vault.deposit_limit ?? 0n, vault.asset.decimals, { fixed: 0, orInfiniteIfGt: 100_000_000_000_000 })}
            </ViewGeneric>
          </td>
        </tr>}

        <tr>
          <td>Performance fee</td>
          <td className="flex justify-end">
            <ViewBps bps={vault.fees?.performanceFee!} className="bg-neutral-900" />
          </td>
        </tr>

        <tr>
          <td>Role manager</td>
          <td className="flex justify-end">
            <EvmAddressChipSlide chainId={vault.chainId} address={vault.roleManager ?? zeroAddress} className="bg-neutral-900" />
          </td>
        </tr>

        <tr>
          <td>Accountant</td>
          <td className="flex justify-end">
            <EvmAddressChipSlide chainId={vault.chainId} address={vault.accountant ?? zeroAddress} className="bg-neutral-900" />
          </td>
        </tr>

        <tr>
          <td>Allocator</td>
          <td className="flex justify-end">
            <EvmAddressChipSlide chainId={vault.chainId} address={vault.allocator ?? zeroAddress} className="bg-neutral-900" />
          </td>
        </tr>

        <tr>
          <td>yHaaS automation</td>
          <td className="flex justify-end">
            <ViewGeneric className="text-warn-400">Off</ViewGeneric>
          </td>
        </tr>

        <tr>
          <td>Version</td>
          <td className="flex justify-end">
            <ViewGeneric>{vault.apiVersion}</ViewGeneric>
          </td>
        </tr>

        <tr>
          <td>Inception</td>
          <td className="flex justify-end">
            <ViewDateOrBlock timestamp={vault.inceptTime} block={vault.inceptBlock} className="bg-neutral-900" />
          </td>
        </tr>
      </tbody>
    </table>
  </Section>
}

export default withVault(Vitals)
