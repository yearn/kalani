import { chains, getRpc } from '@kalani/lib/chains'
import { EvmAddress } from '@kalani/lib/types'
import { createPublicClient, http, type Transaction } from 'viem'

const CHAIN_ID = 1
const EXECUTOR: EvmAddress = '0x0A4d75AB96375E37211Cd00a842d77d0519eeD1B'
const INCEPT = 19483613n
const STRIDE = 10_000n

async function main() {
  const chain = chains[CHAIN_ID]
  const client = createPublicClient({ chain, transport: http(getRpc(CHAIN_ID)) })
  const latest = await client.getBlockNumber()
  console.log('latest', latest)

  let transactions: Transaction[] = []
  let fromBlock = INCEPT
  let toBlock = fromBlock + STRIDE

  while (fromBlock <= latest) {
    console.log('fromBlock - toBlock', fromBlock, toBlock)
    const blocks = await client.getBlocks({
      fromBlock,
      toBlock: BigInt(Math.min(Number(toBlock), Number(latest))),
    })

    for (const block of blocks) {
      const blockTransactions = block.transactions.filter(tx => 
        tx.from.toLowerCase() === EXECUTOR.toLowerCase() || 
        tx.to?.toLowerCase() === EXECUTOR.toLowerCase()
      )
      transactions = transactions.concat(blockTransactions)
    }

    fromBlock = toBlock + 1n
    toBlock = fromBlock + STRIDE
  }

  console.log('transactions.length', transactions.length)
  // You can further process or analyze the transactions here
}

main()
