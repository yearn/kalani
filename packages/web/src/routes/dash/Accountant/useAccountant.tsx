import { z } from 'zod'
import { EvmAddressSchema } from '@kalani/lib/types'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../../lib/env'

export const AccountantSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  feeManager: EvmAddressSchema,
  feeRecipient: EvmAddressSchema,
  futureFeeManager: EvmAddressSchema,
  managementFeeThreshold: z.number({ coerce: true }),
  performanceFeeThreshold: z.number({ coerce: true }),
  maxLoss: z.number({ coerce: true }),
  vaultManager: EvmAddressSchema,
  vaults: EvmAddressSchema.array()
})

export type Accountant = z.infer<typeof AccountantSchema>

const QUERY = `
query Query($chainId: Int!, $address: String!) {
  accountant(chainId: $chainId, address: $address) {
    chainId
    address
    feeManager
    feeRecipient
    futureFeeManager
    managementFeeThreshold
    performanceFeeThreshold
    maxLoss
    vaultManager
    vaults
  }
}
`

export function useAccountantParams() {
  const params = useParams()
  const chainId = Number(params.chainId)
  const address = EvmAddressSchema.parse(params.address)
  return { chainId, address }
}

export function useAccountantFromParams() {
  const params = useAccountantParams()
  return useAccountant(params)
}

export function useAccountant({ chainId, address }: { chainId: number, address: `0x${string}` }) {
  const fetchAccountant = async () => {
    const response = await fetch(KONG_GQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: QUERY,
        variables: { chainId, address }
      })
    })
    const data = await response.json()
    if (!data?.data?.accountant) return undefined
    return AccountantSchema.parse(data?.data?.accountant)
  }

  const { data } = useQuery({
    queryKey: ['accountant', chainId, address],
    queryFn: fetchAccountant
  })

  return data
}

export function withAccountant(WrappedComponent: React.ComponentType<{ accountant: Accountant }>) {
  return function ComponentWithVault(props: any) {
    const accountant = useAccountantFromParams()
    if (!accountant) return <></>
    return <WrappedComponent accountant={accountant} {...props} />
  }
}
