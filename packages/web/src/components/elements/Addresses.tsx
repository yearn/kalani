import { useCallback, useMemo, useState } from 'react'
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
  previous,
  next,
  setNext,
  className
}: { 
  placeholder?: string,
  disabled?: boolean,
  frozen?: boolean,
  onChange?: (addresses: EvmAddress[], isValid: boolean) => void,
  previous?: string,
  next?: string,
  setNext?: (next: string) => void,
  className?: string
}) {
  const [addresses, setAddresses] = useState<string[]>([])

  const _onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (frozen) return
    setNext?.(e.target.value)
    const _addresses = e.target.value.split(/\n/)
    setAddresses(_addresses)
    const isValid = validateAddresses(_addresses)
    const nextAddresses = isValid ? _addresses.map(address => EvmAddressSchema.parse(address)) : []
    onChange?.(nextAddresses, isValid)
  }, [frozen, onChange, validateAddresses, setNext, setAddresses])

  return <div className={`grow group relative rounded-primary ${className}`}>
    <TextGrow
      value={next ?? previous ?? ''}
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
