import { PiInfo } from 'react-icons/pi'
import Fancy from '../../components/Fancy'
import Hero from '../../components/Hero'
import Section from '../../components/Section'
import LabelValueRow from '../../components/elements/LabelValueRow'
import EvmAddressChipSlide from '../../components/ChipSlide/EvmAddressChipSlide'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import { ADDRESS_PROVIDER, APR_ORACLE, ROLE_MANAGER_FACTORY } from '@kalani/lib/addresses'
import A from '../../components/elements/A'

export default function Info() {
  const { chainId: connectedChainId } = useAccount()
  const chainId = useMemo(() => connectedChainId ?? 1, [connectedChainId])

  return <section className="flex flex-col gap-0 sm:gap-8">
    <Hero className="bg-black text-neutral-200">
      <div className="flex items-center gap-6">
        <PiInfo size={64} />
        <div className="flex flex-col gap-0">
          <Fancy text="Info" />
        </div>
      </div>
    </Hero>
    <Section className="flex flex-col gap-primary">
      <LabelValueRow label="Role manager factory">
        <EvmAddressChipSlide chainId={chainId} address={ROLE_MANAGER_FACTORY} className="bg-neutral-900" />
      </LabelValueRow>
      <LabelValueRow label="APR oracle">
        <EvmAddressChipSlide chainId={chainId} address={APR_ORACLE} className="bg-neutral-900" />
      </LabelValueRow>
      <LabelValueRow label="Address provider">
        <EvmAddressChipSlide chainId={chainId} address={ADDRESS_PROVIDER} className="bg-neutral-900" />
      </LabelValueRow>
      <LabelValueRow label="Vaults">
        <A href="https://github.com/yearn/yearn-vaults-v3" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-base whitespace-nowrap">
          https://github.com/yearn/yearn-vaults-v3
        </A>
      </LabelValueRow>
      <LabelValueRow label="Periphery">
        <A href="https://github.com/yearn/vault-periphery" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-base whitespace-nowrap">
          https://github.com/yearn/vault-periphery
        </A>
      </LabelValueRow>
      <LabelValueRow label="Frontend">
        <A href="https://github.com/yearn/kalani" target="_blank" rel="noopener noreferrer" className="pl-24 sm:pl-0 text-xs sm:text-base whitespace-nowrap">
          https://github.com/yearn/kalani
        </A>
      </LabelValueRow>
    </Section>
  </section>
}
