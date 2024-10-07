import { expect } from 'chai'
import { fNumber } from './format'

describe('format', function() {
  describe('fNumber', function() {
    it('pads results', async function() {
      expect(fNumber(0, { padding: { length: 2, fill: '0' } })).to.eq('00.00')
      expect(fNumber(1, { padding: { length: 2, fill: '0' } })).to.eq('01.00')
      expect(fNumber(10, { padding: { length: 2, fill: '0' } })).to.eq('10.00')
      expect(fNumber(100, { padding: { length: 2, fill: '0' } })).to.eq('100.00')
    })
  })
})
