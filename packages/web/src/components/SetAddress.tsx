import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from './elements/Button'
import { UseSimulateContractParameters, useAccount, useReadContracts, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { getAddress, zeroAddress } from 'viem'
import Address from './elements/Address'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { useWriteContract } from '../hooks/useWriteContract'
import { PiCheckFatFill } from 'react-icons/pi'
import FlyInFromBottom from './motion/FlyInFromBottom'
import { compareEvmAddresses } from '@kalani/lib/strings'

function useWrite(
  contract: {
    chainId: number,
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  },
  next: EvmAddress, 
  enabled: boolean
) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    chainId: contract.chainId,
    address: contract.address,
    args: [getAddress(enabled ? next! : zeroAddress)],
    abi: contract.abi,
    functionName: contract.set,
    query: { enabled }
  }), [contract, next, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export default function SetAddress({
  verb,
  permitted,
  contract,
  defaultAddress,
  to,
  checked,
  onConfirm,
  className
}: {
  verb: string,
  permitted: boolean,
  contract: {
    chainId: number,
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  },
  defaultAddress?: EvmAddress,
  to?: EvmAddress,
  checked?: boolean,
  onConfirm?: (address: EvmAddress) => void,
  className?: string 
}) {
  const { isConnected } = useAccount()
  const [previous, setPrevious] = useState<EvmAddress | undefined>(undefined)
  const [next, setNext] = useState<string | undefined>(undefined)
  const [isNextValid, setIsNextValid] = useState<boolean>(false)

  const multicall = useReadContracts({ contracts: [
    { chainId: contract.chainId, address: contract.address, abi: contract.abi, functionName: contract.get },
  ]})

  useEffect(() => {
    if (multicall.data?.every(d => d.status === 'success')) {
      setPrevious(EvmAddressSchema.parse(multicall.data![0].result))
    } else {
      setPrevious(undefined)
    }
  }, [multicall, setPrevious])

  useEffect(() => setNext(previous ?? ''), [setNext, previous])

  const dirty = useMemo(() => Boolean(((previous || next) && !compareEvmAddresses(previous, next))), [previous, next])
  const [_error, setError] = useState<string | undefined>(undefined)

  const {
    simulation, write, confirmation, resolveToast
  } = useWrite(
    contract, 
    EvmAddressSchema.safeParse(to ?? next).data!, 
    isConnected && (dirty || to !== undefined) && EvmAddressSchema.safeParse(to ?? next).success
  )

  useEffect(() => {
    if (confirmation.isSuccess) {
      setPrevious(EvmAddressSchema.parse(next))
      resolveToast()
      onConfirm?.(EvmAddressSchema.parse(next))
    }
  }, [confirmation, setPrevious, next, resolveToast, onConfirm])

  const onChange = useCallback((next: string, isValid: boolean) => {
    setNext(next)
    setIsNextValid(isValid)
    setError(undefined)
    write.reset()
  }, [setNext, setIsNextValid, setError, write])

  useEffect(() => {
    if (simulation.isError) {
      setError(`This will revert, see console for details.`)
      console.error(simulation.error.message)
    }
  }, [simulation, setError])

  const disableInput = useMemo(() => 
    !permitted
    || multicall.isFetching,
  [permitted, multicall])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disableButton = useMemo(() => 
    !permitted
    || !isNextValid 
    || (to === undefined && !dirty)
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [permitted, isNextValid, dirty, simulation, write, confirmation])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  const toNextOrDefault = useMemo(() => {
    if (to) return to
    if (next) return next
    if (defaultAddress) return defaultAddress
    return zeroAddress
  }, [to, next, defaultAddress])

  return <div className={`w-full flex flex-col gap-2 ${className}`}>
    <div className="flex items-center gap-4">
      <Address 
        previous={previous}
        next={toNextOrDefault}
        setNext={setNext}
        isNextValid={isNextValid}
        setIsNextValid={setIsNextValid}
        onChange={onChange} 
        frozen={to !== undefined}
        disabled={disableInput} />
      <div className="relative isolate">
        <div className={checked ? 'invisible' : ''}>
          <Button
            onClick={onClick}
            theme={buttonTheme}
            disabled={disableButton}
            className="w-field-btn h-field-btn"
          >{verb}</Button>
        </div>
        {checked && <div className="absolute inset-0 flex items-center justify-center text-green-400 text-2xl">
          <FlyInFromBottom _key="set-address-checked">
            <PiCheckFatFill />
          </FlyInFromBottom>
        </div>}
      </div>
    </div>
  </div>
}
