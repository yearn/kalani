import { fEvmAddress } from '@kalani/lib/format'
import { getChain } from '../../../lib/chains'
import { Accountant, withAccountant } from './useAccountant'
import Admins from './Admins'
import EvmAddressLayout from '../../../components/EvmAddress'
import ChainImg from '../../../components/ChainImg'

function Page({ accountant }: { accountant: Accountant }) {
  if (!accountant) return <></>

  return <section className={`relative flex flex-col items-start justify-start gap-8`}>
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center gap-3 text-sm">
        accountant
        <EvmAddressLayout chainId={accountant.chainId} address={accountant.address} />
      </div>
      <div className="text-5xl">{fEvmAddress(accountant.address)}</div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <ChainImg chainId={accountant.chainId} />
          {getChain(accountant.chainId).name}
        </div>
      </div>
    </div>
    <Admins />
  </section>
}

export default withAccountant(Page)
