import Link from '../../../../../components/elements/Link'
import EvmAddressLayout from '../../../../../components/EvmAddress'
import Section from '../../../../../components/Section'
import TxHash from '../../../../../components/TxHash'
import { Strategy, Vault, withVault } from '../../../../../hooks/useVault'
import { fBps, fTokens, fUSD } from '@kalani/lib/format'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useMemo } from 'react'
import ReactTimeago from 'react-timeago'
import Scatter from './Scatter'

function StrategyLayout({ vault, strategy }: { vault: Vault, strategy: Strategy }) {
  const latestReport = useMemo(() => {
    return vault.reports.find(report => compareEvmAddresses(report.strategy, strategy.address))
  }, [vault, strategy])

  const series = useMemo(() => {
    return vault.reports.filter(report => compareEvmAddresses(report.strategy, strategy.address))
    .map(report => ({
      x: new Date(Number(report.blockTime) * 1000).toISOString(),
      y: report.apr.net
    }))
  }, [vault, strategy])

  const linkTo = useMemo(() => {
    if (strategy.yearn) return `/strategy/${strategy.chainId}/${strategy.address}`
    return `/erc4626/${strategy.chainId}/${strategy.address}`
  }, [strategy])

  return <Section key={strategy.address} className="w-full flex items-start gap-8">
    <div className="w-1/2 h-[300px] pt-4 flex flex-col gap-1">
      <EvmAddressLayout chainId={strategy.chainId} address={strategy.address} />
      <div className="text-2xl">
        <Link to={linkTo}>{strategy.name}</Link>
      </div>
      <table className="table-auto w-full border-separate border-spacing-0">
        <tbody>
          <tr>
            <td>Debt ratio</td>
            <td className="text-right">{fBps(strategy.targetDebtRatio)}</td>
          </tr>
          <tr>
            <td>Total assets</td>
            <td className="text-right">{fTokens(strategy.currentDebt, vault.asset.decimals)}</td>
          </tr>
          <tr>
            <td>Total assets (USD)</td>
            <td className="text-right">{fUSD(strategy.currentDebtUsd)}</td>
          </tr>
          <tr>
            <td>Last report to vault</td>
            <td className="flex items-center justify-end gap-3">
              {latestReport && <>
                <ReactTimeago date={Number(latestReport.blockTime) * 1000} />
                <TxHash chainId={strategy.chainId} hash={latestReport.transactionHash} />
              </>}
            </td>
          </tr>
          <tr>
            <td>Keeper</td>
            <td className="flex justify-end">
              {strategy.keeper && <EvmAddressLayout chainId={strategy.chainId} address={strategy.keeper} />}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="w-1/2 border border-neutral-900">

      <Scatter series={series} />

    </div>
  </Section>
}

function Strategies({ vault }: { vault: Vault }) {
  const strategies = useMemo(() => {
    return vault.strategies.sort((a, b) => Number(b.currentDebt - a.currentDebt))
  }, [vault])

  return <div className={`flex flex-col gap-8`}>
    {strategies.map(strategy => <StrategyLayout key={strategy.address} vault={vault} strategy={strategy} />)}
  </div>
}

export default withVault(Strategies)
