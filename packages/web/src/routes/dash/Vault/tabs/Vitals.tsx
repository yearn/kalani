import Section from '../../../../components/Section'
import { Vault, withVault } from '../../../../hooks/useVault'
import { div, mulb } from '@kalani/lib/bmath'
import { fBps, fPercent, fTokens, fUSD } from '@kalani/lib/format'
import { useMemo } from 'react'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import { zeroAddress } from 'viem'

function Vitals({ vault }: { vault: Vault }) {
  const idle = useMemo(() => (vault?.totalAssets ?? 0n) - (vault?.totalDebt ?? 0n), [vault])
  const allocated = useMemo(() => vault?.strategies.reduce((acc, strategy) => acc + Number(strategy.targetDebtRatio), 0) ?? 0, [vault])
  const deployed = useMemo(() => {
    const totalAllocated = mulb(vault?.totalAssets ?? 0n, allocated / 10_000)
    return div(vault?.totalDebt ?? 0n, totalAllocated)
  }, [vault, allocated])

  return <Section className="w-full flex items-start gap-8">
    <div className={`
      w-1/2 h-full`}>
      <table className="table-auto w-full border-separate border-spacing-2">
        <tbody>
          <tr>
            <td>Asset</td>
            <td className="text-right">
              <EvmAddressChipSlide chainId={vault.chainId} address={vault.asset.address} className="bg-neutral-950" />
            </td>
          </tr>
          <tr>
            <td className="text-xl">Total assets</td>
            <td className="text-right text-4xl">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
          </tr>
          <tr>
            <td>TVL</td>
            <td className="text-right">{fUSD(vault.tvl?.close ?? 0)}</td>
          </tr>
          <tr>
            <td>Allocated</td>
            <td className="text-right">{fBps(allocated)}</td>
          </tr>
          <tr>
            <td>Deployed</td>
            <td className="text-right">{fPercent(deployed)}</td>
          </tr>
          <tr>
            <td>Idle assets</td>
            <td className="text-right">{fTokens(idle, vault.asset.decimals)}</td>
          </tr>
          {vault.label === 'yVault' && <tr>
            <td>Deposit limit</td>
            <td className="text-right">{fTokens(vault.deposit_limit ?? 0n, vault.asset.decimals, { fixed: 0, orInfiniteIfGt: 100_000_000_000_000 })}</td>
          </tr>}
          <tr>
            <td>Performance fee</td>
            <td className="text-right">{fBps(vault.fees?.performanceFee!)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Section>
}

export default withVault(Vitals)
