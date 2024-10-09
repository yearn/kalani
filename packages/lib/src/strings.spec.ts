import { expect } from 'chai'
import { kabobCase } from './strings'

describe('strings', function() {
  it('kabob cases', async function() {
    expect(kabobCase('fooBar')).to.eq('foo-bar')
    expect(kabobCase('fooBarBaz')).to.eq('foo-bar-baz')
    expect(kabobCase('foo Bar')).to.eq('foo-bar')
    expect(kabobCase('foo Bar Baz')).to.eq('foo-bar-baz')
  })
})
