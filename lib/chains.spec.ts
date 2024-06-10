import { expect } from 'chai'
import { getChain } from './chains'

describe('chains', function() {
  it('rejects bad chain ids', function() {
    const badChainId = 69_666_13_4_9_17_39_26
    expect(() => getChain(badChainId)).to.throw(`bad chainId, ${badChainId}`)
  })
})
