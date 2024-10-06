import { fBps, fTokens } from '@kalani/lib/format'
import { useStrategyFromParams } from '../../../../hooks/useStrategy'
import { Suspense } from 'react'

function Suspender() {
  const { strategy } = useStrategyFromParams()
  return <div>
    <div className={`
      w-1/2 h-full p-4`}>
      <table className="table-auto w-full border-separate border-spacing-2">
        <tbody>
          <tr>
            <td className="text-xl">Total assets</td>
            <td className="text-right text-xl">{fTokens(strategy.totalAssets, strategy.asset.decimals)}</td>
          </tr>
          <tr>
            <td>Performance fee</td>
            <td className="text-right">{fBps(strategy.fees?.performanceFee!)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}

export default function Assets() {
  return <Suspense fallback={<div>Loading...</div>}>
    <Suspender />
  </Suspense>
}
