import { PiVault } from 'react-icons/pi'
import Hero from '../../../components/Hero'
import { useAccount } from 'wagmi'
import Connect from '../../../components/Connect'
import CTA from '../../../components/CTA'
import VaultForm from './VaultForm'

function Brand() {
  return <div className="flex items-center gap-6">
    <PiVault size={64} />
    <div className="flex flex-col gap-0 drop-shadow-lg">
      <div className="flex items-end gap-1">
        <div className="text-5xl font-fancy">B</div>
        <div className="text-4xl font-fancy">uild</div>
      </div>
      <div className="text-xs tracking-widest">Build vaults on Yearn v3</div>
    </div>
  </div>
}

export default function Build() {
  const { isConnected } = useAccount()
  return <section className="flex flex-col gap-8">
    <Hero className="bg-emerald-400 text-neutral-950">
      <Brand />
    </Hero>
    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      <div className="px-10 2xl:px-[18%] py-12 flex flex-col items-center gap-12">
        {!isConnected && <Connect label={<CTA>Connect your wallet</CTA>} />}
        {isConnected && <VaultForm />}
      </div>
    </div>
  </section>
}
