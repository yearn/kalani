import Section from '@/components/Section'
import { Vault, withVault } from '@/hooks/useVault'

function Strategies({ vault }: { vault: Vault }) {
  return <div className={`w-1/2 h-full p-4 flex flex-col gap-8`}>
    {vault.strategies.map(strategy => <Section key={strategy.address} 
      className="flex flex-col gap-12">
      {strategy.name}
    </Section>)}
  </div>
}

export default withVault(Strategies)
