import { z } from 'zod'
import { Vault, withVault } from '../../../../../hooks/useVault'
import TransferRoleManager from './TransferRoleManager'
import Button from '../../../../../components/elements/Button'
import { PiPlus } from 'react-icons/pi'
import { useIsRoleManager } from '../../../../../hooks/useRoleManager'
import SetRoles from './SetRoles'
import { useCallback, useMemo, useState } from 'react'
import { EvmAddressSchema } from '@kalani/lib/types'
import FieldLabelPair from '../../../../../components/FieldLabelPair'
import Section from '../../../../../components/Section'

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

  return <div className="flex flex-col gap-8">
    <Section>
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
    <Section>
      <FieldLabelPair label="Role Manager">
        <TransferRoleManager chainId={vault.chainId} vault={vault.address} />
      </FieldLabelPair>
    </Section>
  </div>
}

export default withVault(Roles)
