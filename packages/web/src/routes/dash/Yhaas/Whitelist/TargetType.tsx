import { PiCheck, PiWarning } from 'react-icons/pi'
import FlyInFromLeft from '../../../../components/motion/FlyInFromLeft'
import { fEvmAddress } from '../../../../lib/format'
import { useTargetType } from './useTargetType'
import { useWhitelist } from './provider'
import Input from '../../../../components/elements/Input'

export default function TargetType() {
  const { targetOrUndefined: target } = useWhitelist()
  const { data: targetType, name } = useTargetType(target)

  if (target === undefined) return <></>

  if (targetType === undefined) return <FlyInFromLeft _key={target}>
    <div className="flex items-center justify-end gap-3 text-sm text-warn-300">
      <PiWarning /><p>{fEvmAddress(target)} is not a vault, strategy, or allocator built on Yearn v3</p>
    </div>
  </FlyInFromLeft>

  return <FlyInFromLeft _key={target}>
    <div className="flex items-center justify-end gap-3 text-sm text-green-400">
      <PiCheck /><p><span className="capitalize">{targetType}</span> built on Yearn v3 detected</p>
    </div>
    <div>
      <Input value={`Name: ${name}`} disabled />
    </div>
  </FlyInFromLeft>
}
