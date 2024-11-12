import { fHexString } from '@kalani/lib/format'
import { HexString } from '@kalani/lib/types'
import Copy from '../Copy'
import { PiArrowRight } from 'react-icons/pi'
import ChipSlide from '.'
import Link from '../elements/Link'

export default function ProjectChipSlide({
  chainId,
  id,
  className
}: {
  chainId: number
  id: HexString
  className?: string
}) {
  const slide = <div className="h-full flex items-center gap-4">
    <Copy text={id} />
    <Link to={`/project/${chainId}/${id}`}><PiArrowRight /></Link>
  </div>

  return <ChipSlide className={className} slide={slide}>Id: {fHexString(id)}</ChipSlide>
}
