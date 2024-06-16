import { EvmAddressSchema } from '@/lib/types'
import { useState } from 'react'
import { Vault, withVault } from '@/hooks/useVault'
import SetAddress from './SetAddress'
import Admins from './Admins'
import Fees from './Fees'

function Accountant({ vault }: { vault: Vault }) {
  const [next, setNext] = useState<string | undefined>(undefined)
  const [isNextValid, setIsNextValid] = useState<boolean>(false)
  return <div className="flex flex-col gap-8">
    <SetAddress {...{ vault, next, setNext, isNextValid, setIsNextValid }} />
    {isNextValid && <Fees vault={vault} accountant={EvmAddressSchema.parse(next)} />}
    {isNextValid && <Admins accountant={EvmAddressSchema.parse(next)} />}
  </div>
}

export default withVault(Accountant)
