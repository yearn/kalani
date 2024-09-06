import { expect } from 'chai'
import { div, max, min, mul, mulb } from './bmath'

describe('math', function() {
  describe('div', function() {
    it('NaN on zero denominator', async function() {
      expect(div(1n, 0n)).to.be.NaN
    })
  
    it('.5 on 1/2', async function() {
      expect(div(1n, 2n)).to.eq(0.5)
    })
  })

  it('muls', async function() {
    expect(mul(1n, .5)).to.eq(.5)
    expect(mul(1_000_000_000_000_000_000n, 1.5)).to.eq(1_500_000_000_000_000_000)
  })

  it('mulbs', async function() {
    expect(mulb(1n, .5)).to.eq(0n)
    expect(mulb(1_000_000_000_000_000_000n, 1.5)).to.eq(1_500_000_000_000_000_000n)
  })

  it('mins', async function() {
    expect(min(1n, 2n)).to.eq(1n)
    expect(min(2n, 1n)).to.eq(1n)
  })

  it('maxs', async function() {
    expect(max(1n, 2n)).to.eq(2n)
    expect(max(2n, 1n)).to.eq(2n)
  })
})
