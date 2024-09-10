import { PiCheck, PiWarning } from 'react-icons/pi'
import FlyInFromLeft from '../../../../components/motion/FlyInFromLeft'
import { TargetType, useTargetInfos } from './useTargetInfos'
import { useWhitelist } from './provider'
import { useAccount } from 'wagmi'
import { EvmAddress } from '@kalani/lib/types'
import { fEvmAddress } from '../../../../lib/format'
import { useMemo } from 'react'
import { cn } from '../../../../lib/shadcn'

function TargetInfo({ 
  _key,
  address,
  name, 
  targetType 
}: {
  _key: string,
  address: EvmAddress,
  name: string | undefined, 
  targetType: TargetType | undefined 
}) {
  const { chain } = useAccount()
  const textColor = useMemo(() => targetType !== undefined ? 'text-green-400' : 'text-yellow-400', [targetType])
  const text = useMemo(() => {
    if (targetType === undefined) return `Yearn v3 contract on ${chain?.name} not found, ${fEvmAddress(address)}`
    return <>V3 {targetType} detected, {fEvmAddress(address)}, {name}</>
  }, [address, name, targetType, chain])
  const icon = useMemo(() => targetType !== undefined ? <PiCheck /> : <PiWarning />, [targetType])
  return <FlyInFromLeft _key={_key}>
    <div className={cn('flex items-center justify-end gap-3 text-sm', textColor)}>
      <div className="grow">{text}</div>{icon}
    </div>
  </FlyInFromLeft>
}

export default function TargetInfos() {
  const { targets } = useWhitelist()
  const { targetInfos } = useTargetInfos(targets)

  if (targetInfos.length === 0) return <></>

  return <div className="px-6 flex flex-col gap-6">
    {targetInfos.map(({ address, name, targetType }, index) => 
      <TargetInfo key={address + index} _key={address + index} address={address} name={name} targetType={targetType} />
    )}
  </div>
}
