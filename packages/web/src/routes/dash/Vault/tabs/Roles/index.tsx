import { z } from 'zod'
import { Vault } from '../../../../../hooks/useVault'
import { withVault } from '../../../../../hooks/useVault/withVault'
import Button from '../../../../../components/elements/Button'
import { PiPlus } from 'react-icons/pi'
import { useIsRoleManager } from '../../../../../hooks/useRoleManager'
import SetRoles from './SetRoles'
import { Suspense, useCallback, useMemo, useState } from 'react'
import { EvmAddressSchema } from '@kalani/lib/types'
import Section from '../../../../../components/Section'
import Skeleton from '../../../../../components/Skeleton'

const AccountRoleItemSchema = z.object({
  chainId: z.number(),
  vault: EvmAddressSchema,
  address: EvmAddressSchema.optional(),
  roleMask: z.bigint({ coerce: true }),
  editAddress: z.boolean()
})

type AccountRoleItem = z.infer<typeof AccountRoleItemSchema>

function Roles({ vault }: { vault: Vault }) {
  const [newAccounts, setNewAccounts] = useState<AccountRoleItem[]>([])
  const isRoleManager = useIsRoleManager(vault)

  const accounts = useMemo<AccountRoleItem[]>(() => {
    const previousAccounts = AccountRoleItemSchema.array().parse(
      vault?.accounts.filter(a => a.roleMask !== 0n ).map(account => ({ ...account, editAddress: false })) ?? []
    )
    return [...previousAccounts, ...newAccounts]
  }, [vault, newAccounts])

  const addAccount = useCallback(() => {
    if (vault) {
      setNewAccounts(current => [...current, {
        chainId: vault.chainId,
        vault: vault.address,
        address: undefined,
        roleMask: 0n,
        editAddress: true
      }])
    }
  }, [vault, setNewAccounts])

  return <Section>
    <div className="flex flex-col gap-6">
      {accounts.map((account, index) => <SetRoles 
        key={index} 
        chainId={account.chainId}
        vault={account.vault} 
        account={account.address}
        editAddress={account.editAddress}
      />)}
      <div className="flex justify-end">
        <Button onClick={addAccount} disabled={!isRoleManager} h={'secondary'}><PiPlus /></Button>
      </div>
    </div>
  </Section>
}

function RolesSkeleton() {
  return <Section>
    <div className="flex flex-col gap-6">
      <Skeleton className="w-full h-12 rounded-primary" />
    </div>
  </Section>
}

const Suspender = withVault(Roles)

function Vitals() {
  return <Suspense fallback={<RolesSkeleton />}>
    <Suspender />
  </Suspense>
}

export default Vitals
