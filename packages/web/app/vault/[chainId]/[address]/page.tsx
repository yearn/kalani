'use client'

import { useParams } from 'next/navigation'
import { EvmAddressSchema } from '@/lib/types'
import ValueLabelPair from '@/components/ValueLabelPair'
import { useVault } from '@/hooks/useVault'
import { fEvmAddress, fNumber, fPercent, fTokens } from '@/lib/format'
import Screen from '@/components/Screen'

export default function Vault() {
  const params = useParams()
  const chainId = Number(params.chainId)
  const address = EvmAddressSchema.parse(params.address)
  const vault = useVault(chainId, address)

  if (!vault) return <></>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem] pb-96
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-2/3 h-48 p-4 flex flex-col justify-center gap-2">
        <div className="text-sm">vault {fEvmAddress(vault.address)}</div>
        <div className="text-5xl">{vault.name}</div>
        <div className="flex items-center gap-12">
          <ValueLabelPair value={fNumber(vault.tvl.close)} label="tvl" className="text-3xl" />
          <ValueLabelPair value={fPercent(vault.apy.close)} label="apy" className="text-3xl" />
        </div>
      </div>
      <Screen className={`
        w-1/3 h-48 flex items-center justify-center
        bg-violet-400`}>
      </Screen>
    </div>
    <div className="w-full flex items-center gap-8">
      <div className={`
        w-1/2 h-full p-4 text-primary-200`}>
        <table className="table-auto w-full">
          <tr>
            <td>Total assets</td>
            <td className="text-right">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
          </tr>
          <tr>
            <td>Allocated</td>
            <td className="text-right"></td>
          </tr>
          <tr>
            <td>Deployed</td>
            <td className="text-right"></td>
          </tr>
          <tr>
            <td>Idle</td>
            <td className="text-right"></td>
          </tr>
          <tr>
            <td>Utilization</td>
            <td className="text-right"></td>
          </tr>
          <tr>
            <td>Deposit limit</td>
            <td className="text-right"></td>
          </tr>
          <tr>
            <td>Performance fee</td>
            <td className="text-right"></td>
          </tr>
        </table>
      </div>
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>

        </table>
      </Screen>
    </div>

    <div className="w-full flex items-center gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`
        w-1/2 h-full p-4 text-primary-200`}>
        <table className="table-auto w-full">
        </table>
      </div>
    </div>

    <div className="w-full flex items-center gap-8">
    <div className={`
        w-1/2 h-full p-4 text-primary-200`}>
        <table className="table-auto w-full">
        </table>
      </div>
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
    </div>

    <div className="w-full flex items-center gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`
        w-1/2 h-full p-4 text-primary-200`}>
        <table className="table-auto w-full">
        </table>
      </div>
    </div>
  </main>
}
