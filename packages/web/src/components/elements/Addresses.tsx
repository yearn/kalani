import { useCallback, useEffect, useMemo, useState } from 'react'
import { EvmAddressSchema } from '../../lib/types'
import { PiCheckCircle, PiWarningCircle } from 'react-icons/pi'
import TextGrow from './TextGrow'
import { EvmAddress } from '@kalani/lib/types'

function validateAddress(address: string) {
  return EvmAddressSchema.safeParse(address).success
}

function validateAddresses(addresses: string[]) {
  return addresses.every(address => validateAddress(address))
}

function IsValidIndicator({ address }: { address: string }) {
  const isValid = useMemo(() => validateAddress(address), [address])
  return <div className={`flex items-center ${isValid ? 'text-green-400' : 'text-yellow-400'}`}>
    &nbsp;{isValid ? <PiCheckCircle /> : <PiWarningCircle />}
  </div>
}

export default function Addresses({ 
  placeholder,
  disabled,
  frozen,
  onChange,
  initialAddresses,
  className
}: { 
  placeholder?: string,
  disabled?: boolean,
  frozen?: boolean,
  onChange?: (addresses: EvmAddress[], isValid: boolean) => void,
  initialAddresses?: EvmAddress[],
  className?: string
}) {
  const [value, setValue] = useState<string>('')
  const [addresses, setAddresses] = useState<string[]>([])

  useEffect(() => {
    setValue(initialAddresses?.join('\n') ?? '')
    setAddresses(initialAddresses || [])
  }, [initialAddresses, setValue, setAddresses])

  const _onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (frozen) return
    setValue(e.target.value)
    const _addresses = e.target.value.split(/\n/)
    setAddresses(_addresses)
    const isValid = validateAddresses(_addresses)
    const changed = isValid ? _addresses.map(address => EvmAddressSchema.parse(address)) : []
    onChange?.(changed, isValid)
  }, [frozen, onChange, validateAddresses, setValue, setAddresses])

  return <div className={`grow group relative rounded-primary ${className}`}>
    <TextGrow
      value={value}
      onChange={_onChange}
      placeholder={placeholder ?? '0x'}
      disabled={disabled ?? false}
      spellCheck={false}
    />
    <div className="absolute inset-0 px-6 py-4 flex flex-col items-end gap-1 pointer-events-none">
      {(addresses.length > 1 || addresses[0]?.length > 0) && addresses.map((address, index) => (
        <IsValidIndicator key={index} address={address} />
      ))}
    </div>
  </div>
}
