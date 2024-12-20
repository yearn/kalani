import { fEvmAddress } from '@kalani/lib/format'
import { EvmAddress } from '@kalani/lib/types'
import Copy from '../Copy'
import { getChain } from '../../lib/chains'
import A from '../elements/A'
import { useMemo } from 'react'
import { PiArrowRight, PiArrowSquareOutBold } from 'react-icons/pi'
import ChipSlide from '.'
import Link from '../elements/Link'

export default function StrategyChipSlide({
  chainId,
  address,
  className
}: {
  chainId: number
  address: EvmAddress
  className?: string
}) {
  const chain = getChain(chainId)
  const href = useMemo(() => {
    const explorer = chain.blockExplorers.default
    return `${explorer.url}/address/${address}`
  }, [chain, address])

  const slide = <div className="h-full flex items-center gap-4">
    <Copy text={address} />
    <A href={href} target="_blank" rel="noreferrer"><PiArrowSquareOutBold /></A>
    <Link to={`/strategy/${chainId}/${address}`}><PiArrowRight /></Link>
  </div>

  return <ChipSlide className={className} slide={slide}>{fEvmAddress(address)}</ChipSlide>
}
