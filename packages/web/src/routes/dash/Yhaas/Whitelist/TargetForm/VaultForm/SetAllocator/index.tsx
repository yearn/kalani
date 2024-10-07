import { useCallback, useEffect, useMemo, useState } from 'react'
import Address from '../../../../../../../components/elements/Address'
import StepLabel from '../../../StepLabel'
import { Switch } from '../../../../../../../components/shadcn/switch'
import { Label } from '../../../../../../../components/shadcn/label'
import Dialog, { DialogButton, useDialog } from '../../../../../../../components/Dialog'
import Button from '../../../../../../../components/elements/Button'
import { useWhitelist } from '../../../provider'
import { fEvmAddress } from '@kalani/lib/format'
import { cn } from '../../../../../../../lib/shadcn'
import Input from '../../../../../../../components/elements/Input'
import { useAccount, useConfig, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { EvmAddress } from '@kalani/lib/types'
import abis from '@kalani/lib/abis'
import { useWriteContract } from '../../../../../../../hooks/useWriteContract'
import { toEventSelector, zeroAddress } from 'viem'
import { numberOr } from '@kalani/lib/nums'
import { useErc20 } from '../../../../../../../hooks/useErc20'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import { useAllocator } from './useAllocator'
import { isNothing } from '@kalani/lib/strings'
import { useAllocatorFactoryAddress } from './useAllocatorFactory'

function useAsset(vault: EvmAddress) {
  const config = useConfig()
  const query = useSuspenseQuery(readContractQueryOptions(config, {  
    address: vault, abi: abis.vault,  functionName: 'asset' 
  }))
  return {
    ...query,
    asset: query.data
  }
}

function useWrite(args: {
  vault: EvmAddress,
  governance: EvmAddress,
  minimumChange: bigint,
  enabled: boolean
}) {
  const { vault, governance, minimumChange, enabled } = args
  const { factory } = useAllocatorFactoryAddress()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address: factory, 
    abi: abis.allocatorFactory, functionName: 'newGenericDebtAllocator',
    args: [vault, governance, minimumChange],
    query: { enabled }
  }), [factory, vault, governance, minimumChange, enabled])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function MinChangeInput({
  disabled,
  asset,
  min,
  onChange, 
  className
}: {
  disabled?: boolean,
  asset: EvmAddress,
  min?: number | undefined,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string
}) {
  const { token } = useErc20({ address: asset })

  return <div className="relative">
    <Input
      disabled={disabled}
      value={isNaN(min ?? 0) ? '' : min ?? ''} 
      type="number"
      onChange={onChange}
      className={className}
      step="0.05"
      />
    <div className={cn(`
      absolute inset-0 pr-14
      flex items-center justify-end
      text-neutral-600 text-2xl
      pointer-events-none`)}>
      {token.symbol ?? ''}
    </div>
  </div>
}

function CreateAllocatorButton() {
  return <DialogButton h="secondary" dialogId="create-allocator" className="w-field-btn h-field-btn text-sm flex flex-col whitespace-normal">
    Create allocator
  </DialogButton>
}

function CreateAllocatorDialog({ 
  vault,
  onNewAllocator
}: { 
  vault: EvmAddress, 
  onNewAllocator: (allocator: EvmAddress) => void
}) {
  const { asset } = useAsset(vault)
  const { token } = useErc20({ address: asset })
  const { closeDialog } = useDialog('create-allocator')
  const [minChange, setMinChange] = useState<number>(0)
  const minimumChange = useMemo<bigint>(() => BigInt(numberOr(minChange) * 10 ** token.decimals), [token, minChange])
  const { isConnected, address: governance } = useAccount()

  const { simulation, write, confirmation, resolveToast } = useWrite({
    vault, 
    governance: governance ?? zeroAddress, 
    minimumChange, 
    enabled: isConnected 
  })

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const execText = useMemo(() => {
    if (simulation.isError) return 'Error'
    return 'Exec'
  }, [simulation])

  const execTooltip = useMemo(() => {
    if (simulation.isError) return simulation.error.stack
    return 'Create new onchain debt allocator'
  }, [simulation])

  const disabled = useMemo(() => 
    simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [simulation, write, confirmation])

  const onExec = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  const NewDebtAllocator = toEventSelector('event NewDebtAllocator(address indexed allocator, address indexed vault)')

  useEffect(() => {
    if (confirmation.isSuccess) {
      const log = confirmation.data.logs.find(log => log.topics[0] === NewDebtAllocator)!
      const allocator = '0x' + log.topics[1]!.slice(-40) as `0x${string}`
      write.reset()
      onNewAllocator(allocator)
      resolveToast()
      closeDialog()
    }
  }, [confirmation, write, onNewAllocator, resolveToast, closeDialog])

  return <Dialog title="Create debt allocator" dialogId="create-allocator">
    <div className="flex flex-col gap-6">
      <div className="text-xl">
        For vault {fEvmAddress(vault)}
      </div>
      <div className="flex items-center gap-8">
        <div className="text-xl whitespace-nowrap">
          Min change
        </div>
        <MinChangeInput disabled={write.isPending} asset={asset} min={minChange} onChange={e => setMinChange(parseFloat(e.target.value))} />
      </div>
      <div className="text-neutral-600 text-sm">
        The minimum amount needed to trigger debt updates.
      </div>
    </div>
    <div className="flex items-center justify-end gap-4">
      <Button h="secondary" onClick={closeDialog}>Cancel</Button>
      <Button h="primary" theme={buttonTheme} onClick={onExec} disabled={disabled} title={execTooltip}>{execText}</Button>
    </div>
  </Dialog>
}

export default function SetAllocator() {
  const { chainId } = useAccount()
  const { targets, setOptions } = useWhitelist()
  const [vault] = targets
  const [allocator, setAllocator] = useState<string | undefined>(undefined)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [automate, setAutomate] = useState<boolean>(false)
  const { allocator: indexedAllocator, data: allocatorData } = useAllocator({ chainId: chainId ?? 0, vault })

  useEffect(() => {
    if (indexedAllocator && isNothing(allocator)) {
      setAllocator(indexedAllocator)
      setIsValid(true)
    }
  }, [indexedAllocator, allocator, setAllocator, setIsValid, allocatorData])

  const onAutomateChanged = useCallback((automate: boolean) => {
    setAutomate(automate)
    setOptions(current => ({ ...current, automate }))
  }, [allocator, setAutomate, setOptions])

  const onNewAllocator = useCallback((allocator: EvmAddress) => {
    setAllocator(allocator)
    setIsValid(true)
    setOptions(current => ({ ...current, allocator }))
    onAutomateChanged(true)
  }, [setAllocator, setIsValid, setOptions, onAutomateChanged])

  return <div className="flex items-start gap-12">
    <StepLabel step={4} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Automate debt allocation (optional)</p>
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Address
            previous={undefined} 
            next={allocator}
            isNextValid={isValid} 
            setIsNextValid={setIsValid} 
            frozen={true}
          />
          <CreateAllocatorButton />
          <CreateAllocatorDialog vault={vault} onNewAllocator={onNewAllocator} />
        </div>
        <div>
          <span className="group mx-6 inline-flex items-center gap-4">
            <Switch disabled={!isValid} id="automate-allocator" checked={automate} onCheckedChange={onAutomateChanged} />
            <Label htmlFor="automate-allocator">Automate debt allocation</Label>
          </span>
        </div>
      </div>
    </div>
  </div>
}
