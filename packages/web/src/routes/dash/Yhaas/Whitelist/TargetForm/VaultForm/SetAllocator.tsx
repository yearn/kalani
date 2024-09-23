import { useCallback, useState } from 'react'
import Address from '../../../../../../components/elements/Address'
import StepLabel from '../../StepLabel'
import { Switch } from '../../../../../../components/shadcn/switch'
import { Label } from '../../../../../../components/shadcn/label'
import Dialog, { DialogButton, useDialog } from '../../../../../../components/Dialog'
import Button from '../../../../../../components/elements/Button'
import { useWhitelist } from '../../provider'
import { fEvmAddress } from '@kalani/lib/format'
import { cn } from '../../../../../../lib/shadcn'
import Input from '../../../../../../components/elements/Input'
import { useAccount } from 'wagmi'

function MinChangeInput({
  disabled, 
  min, 
  onChange, 
  className
}: {
  disabled?: boolean,
  min?: number | string | undefined,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string
}) {
  const { chain } = useAccount()
  const symbol = chain?.nativeCurrency?.symbol ?? 'ETH'

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  return <div className="relative">
    <Input
      disabled={disabled}
      value={min ?? ''} 
      type="number"
      onChange={onChange}
      onKeyDown={onKeyDown}
      className={className}
      />
    <div className={cn(`
      absolute inset-0 pr-14
      flex items-center justify-end
      text-neutral-600 text-2xl
      pointer-events-none`)}>
      {symbol}
    </div>
  </div>
}

export default function SetAllocator() {
  const [allocator, setAllocator] = useState<string | undefined>(undefined)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [automate, setAutomate] = useState<boolean>(false)
  const { closeDialog } = useDialog('create-allocator')
  const { targets } = useWhitelist()
  const vault = targets[0]

  return <div className="flex items-start gap-12">
    <StepLabel step={4} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Automate debt allocation (optional)</p>
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Address
            previous={undefined} 
            next={allocator} 
            setNext={setAllocator} 
            isNextValid={isValid} 
            setIsNextValid={setIsValid} 
            frozen={true}
          />
          <DialogButton h="secondary" dialogId="create-allocator" className="w-field-btn h-field-btn text-sm flex flex-col whitespace-normal">
            Create allocator
          </DialogButton>
          <Dialog title="Create debt allocator" dialogId="create-allocator">
            <div className="flex flex-col gap-6">
              <div className="text-xl">
                For vault {fEvmAddress(vault)}
              </div>
              <div className="flex items-center gap-8">
                <div className="text-xl whitespace-nowrap">
                  Min change
                </div>
                <MinChangeInput min={0} />
              </div>
              <div className="text-neutral-600 text-sm">
                The minimum amount needed to trigger debt updates.
              </div>
            </div>
            <div className="flex items-center justify-end gap-4">
              <Button h="secondary" onClick={closeDialog}>Cancel</Button>
              <Button h="primary">Exec</Button>
            </div>
          </Dialog>
        </div>
        <div>
          <span className="group mx-6 inline-flex items-center gap-4">
            <Switch disabled={false} id="automate-allocator" checked={automate} onCheckedChange={setAutomate} />
            <Label htmlFor="automate-allocator">Automate debt allocation</Label>
          </span>
        </div>
      </div>
    </div>
  </div>
}
