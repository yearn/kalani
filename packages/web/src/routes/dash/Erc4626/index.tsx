import ValueLabelPair from '../../../components/ValueLabelPair'
import { useVaultFromParams } from '../../../hooks/useVault'
import { fNumber, fPercent } from '@kalani/lib/format'
import { getChain } from '../../../lib/chains'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/shadcn/tabs'
import Assets from './tabs/Assets'
import ChainImg from '../../../components/ChainImg'
import EvmAddressLayout from '../../../components/EvmAddress'
import Hero from '../../../components/Hero'

export default function Erc4626() {
  const vault = useVaultFromParams()
  if (!vault) return <></>

  return <section className="flex flex-col gap-8">
    <Hero className="bg-secondary-400 text-secondary-950">
      <div className="grow flex flex-col justify-center gap-2">
        <div className="flex items-center gap-3 text-sm">
          erc4626 
          <EvmAddressLayout chainId={vault.chainId} address={vault.address} />
        </div>
        <div className="text-4xl font-fancy">{vault.name}</div>
        <div className="flex items-center gap-8">
          <ChainImg chainId={vault.chainId} />
          <ValueLabelPair value={fNumber(vault.tvl.close)} label="tvl" className="text-4xl" />
          <ValueLabelPair value={fPercent(vault.apy?.close ?? NaN)} label="apy" className="text-4xl" />
        </div>
      </div>
      <div className={`flex items-center justify-center justify-center gap-12`}>
      </div>
    </Hero>

    <Tabs defaultValue="assets" className="w-full">
      <TabsList>
        <TabsTrigger value="assets">Assets</TabsTrigger>
      </TabsList>
      <TabsContent value="assets"><Assets /></TabsContent>
    </Tabs>
  </section>
}
