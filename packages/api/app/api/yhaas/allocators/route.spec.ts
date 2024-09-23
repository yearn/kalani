import { expect, use } from 'chai'
import { isYVault } from './route'
import { createPublicClient, http } from 'viem'
import { chains, getRpc } from '@kalani/lib/chains'

describe('api / yhaas / allocators', function() {
  it('detects yvaults', async function() {
    const client = createPublicClient({ chain: chains[137], transport: http(getRpc(137)) })
    expect(await isYVault(client, '0x28F53bA70E5c8ce8D03b1FaD41E9dF11Bb646c36')).to.be.true
  })

  it('detects not yvaults', async function() {
    const client = createPublicClient({ chain: chains[137], transport: http(getRpc(137)) })
    expect(await isYVault(client, '0x70997970C51812dc3A010C7d01b50e0d17dc79C8')).to.be.false
  })
})
