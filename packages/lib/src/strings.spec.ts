import { expect } from 'chai'
import { kabobCase, parseInputNumberString } from './strings'

describe('strings', function() {
  it('kabob cases', async function() {
    expect(kabobCase('fooBar')).to.eq('foo-bar')
    expect(kabobCase('fooBarBaz')).to.eq('foo-bar-baz')
    expect(kabobCase('foo Bar')).to.eq('foo-bar')
    expect(kabobCase('foo Bar Baz')).to.eq('foo-bar-baz')
  })

  it('parses input strings into number strings', async function() {
    expect(parseInputNumberString('123')).to.eq('123')
    expect(parseInputNumberString('1,234')).to.eq('1.234')
    expect(parseInputNumberString('1,234.56')).to.eq('1.23456')
    expect(parseInputNumberString('1.234,56')).to.eq('1.23456')
    expect(parseInputNumberString('abc123.45xyz')).to.eq('123.45')
    expect(parseInputNumberString('1.234.567,89')).to.eq('1.23456789')
    expect(parseInputNumberString('1,234,567.89')).to.eq('1.23456789')
    expect(parseInputNumberString('')).to.eq('')
    expect(parseInputNumberString(' ')).to.eq('')
    expect(parseInputNumberString('  ')).to.eq('')
    expect(() => parseInputNumberString(undefined as any)).to.throw()
    expect(() => parseInputNumberString(null as any)).to.throw()
  })
})
