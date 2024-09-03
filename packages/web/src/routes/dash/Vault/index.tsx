import ValueLabelPair from '../../../components/ValueLabelPair'
import { useVaultFromParams } from '../../../hooks/useVault'
import { fNumber, fPercent } from '../../../lib/format'
import { getChain } from '../../../lib/chains'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/shadcn/tabs'
import Roles from './tabs/Roles'
import Assets from './tabs/Assets'
import Strategies from './tabs/Strategies'
import Accountant from './tabs/Accountant'
import Allocator from './tabs/Allocator'
import Reports from './tabs/Reports'
import ChainImage from '../../../components/ChainImage'
import EvmAddressLayout from '../../../components/EvmAddress'

export default function Vault() {
  const vault = useVaultFromParams()
  if (!vault) return <></>

  return <section className={"relative flex flex-col items-start justify-start gap-8"}>
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center gap-3 text-sm">
        {vault.label}
        <EvmAddressLayout chainId={vault.chainId} address={vault.address} />
      </div>
      <div className={`text-4xl font-fancy`}>{vault.name}</div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <ChainImage chainId={vault.chainId} />
          {getChain(vault.chainId).name}
        </div>
        <ValueLabelPair value={fNumber(vault.tvl.close)} label="tvl" className="text-4xl" />
        <ValueLabelPair value={fPercent(vault.apy?.close ?? NaN)} label="apy" className="text-4xl" />
      </div>
    </div>

    <Tabs defaultValue="assets" className="w-full">
      <TabsList>
        <TabsTrigger value="assets">Assets</TabsTrigger>
        <TabsTrigger value="strategies">Strategies</TabsTrigger>
        <TabsTrigger value="accountant">Accountant</TabsTrigger>
        {vault.strategies.length > 1 && <TabsTrigger value="allocator">Allocator</TabsTrigger>}
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
      </TabsList>
      <TabsContent value="assets"><Assets /></TabsContent>
      <TabsContent value="strategies"><Strategies /></TabsContent>
      <TabsContent value="accountant"><Accountant /></TabsContent>
      <TabsContent value="allocator"><Allocator /></TabsContent>
      <TabsContent value="reports"><Reports /></TabsContent>
      <TabsContent value="roles"><Roles /></TabsContent>
    </Tabs>

    {/* <div className="w-full flex items-center gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`
        w-1/2 h-full p-4 text-primary-200`}>
        <table className="table-auto w-full">
          <tbody>
            <tr>
              <td>Total assets</td>
              <td className="text-right">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
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
            <tr>
              <td>Deposit limit</td>
              <td className="text-right">{fTokens(vault.deposit_limit, vault.asset.decimals, { fixed: 0 })}</td>
            </tr>
            <tr>
              <td>Accountant</td>
              <td className="text-right">{fEvmAddress(vault.accountant)}</td>
            </tr>
            <tr>
              <td>Performance fee</td>
              <td className="text-right">{fBps(vault.fees.performanceFee)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="w-full flex items-start gap-8">
      <div className={`w-1/2 h-full p-4 text-primary-200`}>
        <div className="text-xl">Strategies</div>
        {vault.strategies.map(strategy => <div key={strategy.address}>
          {strategy.name}
        </div>)}
      </div>
      <Screen className={`
        w-1/2 p-4 flex items-center justify-between
        border border-neutral-800`}>
        <div className="grow flex flex-col items-center">
          <Pie data={currentDebtPieData} size={200} />
          <div>current debt</div>
        </div>
        <div className="grow flex flex-col items-center">
          <Pie data={targetDebtPieData} size={200} />
          <div>target debt</div>
        </div>
      </Screen>
    </div>

    <div className="w-full flex items-start gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`w-1/2 h-full p-4 text-primary-200`}>
        <div className="text-xl">Roles</div>
      </div>
    </div> */}
  </section>
}
