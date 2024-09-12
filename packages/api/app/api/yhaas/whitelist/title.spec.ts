import { expect, use } from 'chai'
import { generateTitle } from './title'
import leven from 'leven'

declare global {
  namespace Chai {
    interface Assertion {
      approximatelyEqual(expected: string, maxDistance: number): void;
    }
  }
}

use(function (_chai, utils) {
  _chai.Assertion.addMethod('approximatelyEqual', function (expected, maxDistance) {
    const actual = this._obj
    const distance = leven(actual, expected)
    this.assert(
      distance <= maxDistance,
      `expected "${actual}" to be approximately equal to "${expected}" within a Levenshtein distance of ${maxDistance}, but got ${distance}`,
      `expected "${actual}" to not be approximately equal to "${expected}" within a Levenshtein distance of ${maxDistance}`,
      expected,
      actual
    )
  })
})

describe.only('title', function() {
  it('generates undefined', async function() {
    expect(await generateTitle([])).to.be.undefined
  })

  it('returns the same name for one name', async function() {
    expect(await generateTitle(['same'])).to.equal('same')
  })

  it('generates titles', async function() {
    const title = await generateTitle([
      'Silo Lender: USDC/PT-ezETH (26 Sep)',
      'Silo Lender: USDC/PT-eETH (26 Sep)',
      'Silo Lender: USDC/PT-pufETH (26 Sep)',
      'Silo Lender: USDC/ezETH',
      'Silo Lender: USDC/weETH',
      'Silo Lender: USDC/rstETH',
      'Silo Lender: USDC/amphrETH',
      'Silo Lender: USDC/pzETH',
      'Silo Lender: USDC/Re7LRT'
    ])
    expect(title).to.approximatelyEqual('Silo Lender: USDC/ETH Variants', 6)
  })
})
