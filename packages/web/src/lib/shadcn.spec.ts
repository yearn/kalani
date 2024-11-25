import { expect } from 'chai'
import { borderPrimaryRegex, cn } from './shadcn'

describe('shadcn', function() {
  it('matches border-primary', function() {
    expect(cn('border-primary')).to.match(borderPrimaryRegex)
    expect(cn('border-x-primary')).to.match(borderPrimaryRegex)
    expect(cn('xx:border-primary')).to.match(borderPrimaryRegex)
    expect(cn('xx:border-x-primary')).to.match(borderPrimaryRegex)
  })
})
