import { fHexString } from '@kalani/lib/format'
import { HexString } from '@kalani/lib/types'
import Copy from '../Copy'
import { getChain } from '../../lib/chains'
import A from '../elements/A'
import { useMemo } from 'react'
import { PiArrowSquareOutBold } from 'react-icons/pi'
import ChipSlide from '.'

export default function TxChipSlide({
  chainId,
  txhash,
  className
}: {
  chainId: number
  txhash: HexString
  className?: string
}) {
  const chain = getChain(chainId)
  const href = useMemo(() => {
    const explorer = chain.blockExplorers.default
    return `${explorer.url}/tx/${txhash}`
  }, [chain, txhash])

  const slide = <div className="h-full flex items-center gap-4">
    <Copy text={txhash} />
    <A href={href} target="_blank" rel="noreferrer"><PiArrowSquareOutBold /></A>
  </div>

  return <ChipSlide className={className} slide={slide}>{fHexString(txhash)}</ChipSlide>
}
