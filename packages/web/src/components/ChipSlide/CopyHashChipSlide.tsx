import { fHexString } from '@kalani/lib/format'
import { HexString } from '@kalani/lib/types'
import Copy from '../Copy'
import ChipSlide from '.'

export default function CopyHashChipSlide({
  hash,
  className
}: {
  hash: HexString
  className?: string
}) {
  const slide = <div className="h-full flex items-center gap-4">
    <Copy text={hash} />
  </div>

  return <ChipSlide className={className} slide={slide}>{fHexString(hash)}</ChipSlide>
}
