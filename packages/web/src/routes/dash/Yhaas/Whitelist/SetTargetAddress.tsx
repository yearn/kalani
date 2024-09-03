import { useEffect, useState } from 'react'
import { EvmAddress, EvmAddressSchema } from '../../../../lib/types'
import InputAddress from '../../../../components/InputAddress'
import { useWhitelist } from './provider'

export default function SetTargetAddress({
  onValidAddress
}: {
  onValidAddress?: (address: EvmAddress) => void
}) {
  const { target, setTarget, setFrequency } = useWhitelist()
  const [isNextValid, setIsNextValid] = useState<boolean>(false)

  useEffect(() => {
    if (target && isNextValid) {
      onValidAddress?.(EvmAddressSchema.parse(target))
      setFrequency(259200)
    }
  }, [target, isNextValid, setTarget, onValidAddress, setFrequency])

  return <InputAddress next={target} setNext={setTarget} isNextValid={isNextValid} setIsNextValid={setIsNextValid} />
}
