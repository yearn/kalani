import { useVaultFromParams } from '@/hooks/useVault'
import SetAccountant from '../SetAccountant'

export default function Accountant() {
  const vault = useVaultFromParams()

  if (!vault) return <></>

  return <div>
    <SetAccountant vault={vault.address} />
  </div> 
}
