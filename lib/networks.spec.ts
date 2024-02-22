import { expect } from 'chai'
import { networks } from './networks'

describe('networks', function() {
  it('rejects bad chain ids', function() {
    const badChainId = 69_666_13_4_9_17_39_26
    expect(() => networks(badChainId)).to.throw(`bad chainId, ${badChainId}`)
  })
})
