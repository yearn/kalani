import { useVaultFromParams } from '@/hooks/useVault'

export default function Strategies() {
  const vault = useVaultFromParams()

  if (!vault) return <></>

  return <div className={`w-1/2 h-full p-4`}>
    {vault.strategies.map(strategy => <div key={strategy.address}>
      {strategy.name}
    </div>)}
  </div>
}
