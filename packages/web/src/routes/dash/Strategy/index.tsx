import ValueLabelPair from '../../../components/ValueLabelPair'
import { useVaultFromParams } from '../../../hooks/useVault'
import { fNumber, fPercent } from '@kalani/lib/format'
import { getChain } from '../../../lib/chains'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/shadcn/tabs'
import Assets from './tabs/Assets'
import Reports from './tabs/Reports'
import ChainImg from '../../../components/ChainImg'
import EvmAddressLayout from '../../../components/EvmAddress'

export default function Strategy() {
  const vault = useVaultFromParams()

  if (!vault) return <></>

  return <section className={`
    relative w-6xl max-w-6xl mx-auto
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-1/2 h-48 p-4 flex flex-col justify-center gap-2">
        <div className="flex items-center gap-3 text-sm">
          tokenized strategy 
          <EvmAddressLayout chainId={vault.chainId} address={vault.address} />
        </div>
        <div className="text-4xl font-fancy">{vault.name}</div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <ChainImg chainId={vault.chainId} />
            {getChain(vault.chainId).name}
          </div>
          <ValueLabelPair value={fNumber(vault.tvl.close)} label="tvl" className="text-4xl" />
          <ValueLabelPair value={fPercent(vault.apy?.close ?? NaN)} label="apy" className="text-4xl" />
        </div>
      </div>
      <div className={`
        w-1/2 h-48 flex items-center justify-center justify-center gap-12`}>
        <div>latest report</div>
      </div>
    </div>

    <Tabs defaultValue="assets" className="w-full">
      <TabsList>
        <TabsTrigger value="assets">Assets</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="assets"><Assets /></TabsContent>
      <TabsContent value="reports"><Reports /></TabsContent>
    </Tabs>
  </section>
}
