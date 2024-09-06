import { EvmAddress } from '@kalani/lib/types'
import { EvmChain } from '@moralisweb3/common-evm-utils'
import Moralis from 'moralis'

const MORALIS_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImRmMmIwOTk5LTUzZTUtNGI5NC1iZmM3LWI4M2VlZGI0NzQ5MCIsIm9yZ0lkIjoiMjQ2Nzk0IiwidXNlcklkIjoiMjQ5NzM5IiwidHlwZUlkIjoiZjAzYjA3NjEtZTA3Mi00MGY3LTk0MjMtZDA1NjY5ODkwMjMxIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODM3MDg4OTYsImV4cCI6NDgzOTQ2ODg5Nn0.3VnzSNTYNpVzfeo1u0vWiAthIxIq_ncCSqgJ3mtb1wY'
const EXECUTOR: EvmAddress = '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B'

async function main() {
  await Moralis.start({ apiKey: MORALIS_API_KEY })

  // 10 CU usage
  // const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
  //   address: EXECUTOR,
  //   chain: EvmChain.ETHEREUM
  // })
  // console.log(nativeBalance.result.balance.ether)

  // 150 CU usage
  // https://docs.moralis.io/web3-data-api/evm/reference/wallet-api/get-wallet-history?address=0xcB1C1FdE09f811B294172696404e88E658659905&chain=eth&order=DESC
  // https://docs.moralis.io/web3-data-api/evm/reference/pagination
  const response = await Moralis.EvmApi.wallets.getWalletHistory({
    chain: EvmChain.ETHEREUM,
    address: EXECUTOR,
    includeInternalTransactions: false
  })

  console.log(response)
}

main()
