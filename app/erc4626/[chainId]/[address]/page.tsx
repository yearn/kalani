'use client'

import ValueLabelPair from '@/components/ValueLabelPair'
import { useVaultFromParams } from '@/hooks/useVault'
import { fEvmAddress, fNumber, fPercent } from '@/lib/format'
import { getChain } from '@/lib/chains'
import { fancy } from '@/lib/fancy'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import Assets from './tabs/Assets'

export default function Erc4626() {
  const vault = useVaultFromParams()

  if (!vault) return <></>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem] pb-96
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-1/2 h-48 p-4 flex flex-col justify-center gap-2">
        <div className="text-sm">erc4626 {fEvmAddress(vault.address)}</div>
        <div className={`text-4xl ${fancy.className}`}>{vault.name}</div>
        <div className="flex items-center gap-8">
          <div>
            <div>[{getChain(vault.chainId).name}]</div>
          </div>
          <ValueLabelPair value={fNumber(vault.tvl.close)} label="tvl" className="text-4xl" />
          <ValueLabelPair value={fPercent(vault.apy.close)} label="apy" className="text-4xl" />
        </div>
      </div>
      <div className={`
        w-1/2 h-48 flex items-center justify-center justify-center gap-12`}>
      </div>
    </div>

    <Tabs defaultValue="assets" className="w-full">
      <TabsList>
        <TabsTrigger value="assets">Assets</TabsTrigger>
      </TabsList>
      <TabsContent value="assets"><Assets /></TabsContent>
    </Tabs>
  </main>
}
