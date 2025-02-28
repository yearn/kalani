import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EvmAddressSchema, EvmAddress, ALL_ROLES_MASK, AccountRoleSchema } from '@kalani/lib/types'
import { useCallback, useMemo } from 'react'
import { KONG_GQL_URL } from '../../../lib/env'
import { useLocalVaults } from '../../../hooks/useVault'
import { FinderItem, useFinderItems } from '../../../components/Finder/useFinderItems'
import { compareEvmAddresses } from '@kalani/lib/strings'

const AccountVaultSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema
})

const QUERY = `
query Query($account: String!, $chainId: Int) {
  accountVaults(account: $account, chainId: $chainId) {
    chainId
    address
  }

  accountRoles(account: $account, chainId: $chainId) {
    chainId
    vault: address
    address: account
    roleMask
  }
}
`

export function useAccountItems(account: EvmAddress) {
  const { items: allFinderItems } = useFinderItems()

  const query = useSuspenseQuery({
    queryKey: ['accountVaults', account],
    queryFn: async () => {
      if (!account) return null

      const response = await fetch(KONG_GQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: QUERY,
          variables: { account }
        })
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      return response.json()
    }
  })

  const { localVaults } = useLocalVaults()

  const vaults = useMemo(() => {
    const queryVaults = AccountVaultSchema.array().parse(query.data?.data?.accountVaults ?? [])
    const localVaultsParsed = AccountVaultSchema.array().parse(localVaults)

    const uniqueLocalVaults = localVaultsParsed.filter(localVault =>
      !queryVaults.some(queryVault =>
        queryVault.chainId === localVault.chainId && compareEvmAddresses(queryVault.address, localVault.address)
      )
    )

    return [...queryVaults, ...uniqueLocalVaults]
  }, [query, localVaults])

  const items = useMemo(() => {
    return allFinderItems.filter(item => vaults.some(vault => vault.chainId === item.chainId && vault.address === item.address))
  }, [vaults, allFinderItems])

  const roles = useMemo(() => {
    return [
      ...AccountRoleSchema.array().parse(query.data?.data?.accountRoles ?? []),
      ...localVaults.map(vault => AccountRoleSchema.parse({
        chainId: vault.chainId,
        vault: vault.address,
        address: account,
        roleMask: ALL_ROLES_MASK
      }))
    ]
  }, [query, localVaults, account])

  const findRoleForItem = useCallback((item: FinderItem) => {
    return roles.find(role => role.vault === item.address && role.chainId === item.chainId)
  }, [roles])

  return { query, items, roles, findRoleForItem }
}

