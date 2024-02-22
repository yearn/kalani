import { expect } from 'chai'
import makeIssueMarkdown from './issue'

describe('issue', function() {
  it('makes issue markdown', function() {
    const md = makeIssueMarkdown(
      'test', 137, 
      ['0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5', '0xDAFEA492D9c6733ae3d56b7Ed1ADB60692c98Bc5'], 
      'https://github.com/murderteeth/yAuto', 
      'daily'
    )
    expect(md).to.not.be.empty
  })
})
