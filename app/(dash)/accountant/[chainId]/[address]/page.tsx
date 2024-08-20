'use client'

import { fEvmAddress } from '@/lib/format'
import { getChain } from '@/lib/chains'
import { Accountant, withAccountant } from '@/hooks/useAccountant'
import Admins from './Admins'
import EvmAddressLayout from '@/components/EvmAddress'
import { ChainImage } from '@/components/ChainImage'

function Page({ accountant }: { accountant: Accountant }) {
  if (!accountant) return <></>

  return <main className={`relative flex flex-col items-start justify-start gap-8`}>
    <div className="flex flex-col justify-center gap-2">
      <div className="flex items-center gap-3 text-sm">
        accountant
        <EvmAddressLayout chainId={accountant.chainId} address={accountant.address} />
      </div>
      <div className="text-5xl">{fEvmAddress(accountant.address)}</div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          <ChainImage chainId={accountant.chainId} />
          {getChain(accountant.chainId).name}
        </div>
      </div>
    </div>
    <Admins />
  </main>
}

export default withAccountant(Page)
