import useSWR from 'swr'

const QUERY = `
query Query($account: String!, $chainId: Int) {
  accountRoles(account: $account, chainId: $chainId) {
    chainId
    address
    account
    roleMask
  }
  accountVaults(account: $account, chainId: $chainId) {
    chainId
    address
    name
    tvl { close }
    apy { close }
  }
}
`

export function useVaults(account?: `0x${string}` | null) {
  if(!account) return undefined

  const endpoint = 'https://kong-two.vercel.app/api/gql'

  const { data } = useSWR(
    `${endpoint}`, (...args) => fetch(...args, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: QUERY,
        variables: { account }
      })
    }).then(res => res.json()).catch(reason => {
      console.error(reason)
      return {}
    }),
    { refreshInterval: parseInt(process.env.NEXT_PUBLIC_USEVAULTS_REFRESH || '10_000') }
  )

  return data
}