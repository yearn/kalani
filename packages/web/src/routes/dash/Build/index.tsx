import { PiVault } from 'react-icons/pi'
import Hero from '../../../components/Hero'
import { useAccount } from 'wagmi'
import Connect from '../../../components/Connect'
import CTA from '../../../components/CTA'
import VaultForm from './VaultForm'
import Fancy from '../../../components/Fancy'
 
function Brand() {
  return <div className="flex items-center gap-6">
    <div className="p-3 rounded-full flex items-center justify-center text-black bg-primary-400">
      <PiVault size={48} />
    </div>
    <Fancy text="Build" />
  </div>
}

export default function Build() {
  const { isConnected } = useAccount()
  return <section className="flex flex-col gap-8">
    <Hero>
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
