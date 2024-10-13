import { fEvmAddress } from '@kalani/lib/format'
import { getChain } from '../../../lib/chains'
import { Accountant, withAccountant } from './useAccountant'
import Admins from './Admins'
import EvmAddressLink from '../../../components/EvmAddressLink'
import ChainImg from '../../../components/ChainImg'
import Hero from '../../../components/Hero'

function Page({ accountant }: { accountant: Accountant }) {
  if (!accountant) return <></>

  return <section className="flex flex-col gap-8">
    <Hero className="bg-green-400 text-green-950">
      <div className="flex flex-col justify-center gap-2">
        <div className="flex items-center gap-3 text-sm">
          accountant
          <EvmAddressLink chainId={accountant.chainId} address={accountant.address} />
        </div>
        <div className="text-5xl">{fEvmAddress(accountant.address)}</div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <ChainImg chainId={accountant.chainId} />
            {getChain(accountant.chainId).name}
          </div>
        </div>
      </div>
    </Hero>
    <Admins />
  </section>
}

export default withAccountant(Page)
