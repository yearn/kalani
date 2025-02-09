import { expect } from 'chai'
import { kabobCase, parseInputNumberString, isNumber } from './strings'

describe('strings', function() {
  it('kabob cases', async function() {
    expect(kabobCase('fooBar')).to.eq('foo-bar')
    expect(kabobCase('fooBarBaz')).to.eq('foo-bar-baz')
    expect(kabobCase('foo Bar')).to.eq('foo-bar')
    expect(kabobCase('foo Bar Baz')).to.eq('foo-bar-baz')
  })

  it('parses input strings into number strings', async function() {
    expect(parseInputNumberString('.')).to.eq('.')
    expect(parseInputNumberString('.123')).to.eq('.123')
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

  it('checks if a string is a number', async function() {
    expect(isNumber('123')).to.be.true
    expect(isNumber('123.45')).to.be.true
    expect(isNumber('abc')).to.be.false
    expect(isNumber('1.234.567,89')).to.be.false
    expect(isNumber('1,234,567.89')).to.be.true
    expect(isNumber('.')).to.be.false
    expect(isNumber('')).to.be.false
    expect(isNumber(null)).to.be.false
    expect(isNumber(undefined)).to.be.false
    expect(isNumber(NaN)).to.be.false
    expect(isNumber(Infinity)).to.be.true
    expect(isNumber(-Infinity)).to.be.true
  })
})
