import { useAccount } from 'wagmi'
import Input from '../../../components/elements/Input'
import StepLabel from '../../../components/forms/StepLabel'
import SelectErc20 from '../../../components/SelectErc20'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import FlyInFromBottom from '../../../components/motion/FlyInFromBottom'
import { Suspense, useEffect } from 'react'
import Actions from './Actions'
import { cn } from '../../../lib/shadcn'
import InputSeconds from './InputSeconds'

function Step1() {
  const { chain } = useAccount()
  const { asset, setAsset } = useVaultFormData()
  return <div className="flex items-start gap-12">
    <StepLabel step={1} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">What asset (erc20 token) will your vault hold?</p>
      <SelectErc20 chainId={chain?.id} placeholder="Find asset by name or address" selected={asset} onSelect={setAsset} />
    </div>
  </div>
}

function Step2() {
  const { chainId } = useAccount()
  const { profitMaxUnlockTime, setProfitMaxUnlockTime } = useVaultFormData()
  const { profitMaxUnlockTimeValidation } = useVaultFormValidation()

  useEffect(() => {
    if (chainId && (profitMaxUnlockTime === undefined)) {
      const Day = 60 * 60 * 24
      setProfitMaxUnlockTime(chainId === 1 ? 5 * Day : 3 * Day)
    }
  }, [chainId, profitMaxUnlockTime, setProfitMaxUnlockTime])

  return <div className="flex items-start gap-12">
    <StepLabel step={2} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Set the amount of time it should take to unlock the profits your strategies harvest.</p>
      <div>
        <InputSeconds 
          seconds={profitMaxUnlockTime}
          startInDaysMode={true}
          onChange={e => setProfitMaxUnlockTime(Number(e.target.value))}
          isValid={profitMaxUnlockTimeValidation.isValid}
          validationMessage={profitMaxUnlockTimeValidation.message}
        />
      </div>
    </div>
  </div>
}

function Step3() {
  const { name, setName, symbol, setSymbol } = useVaultFormData()
  return <div className="flex items-start gap-12">
    <StepLabel step={3} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">What's your vault's name and symbol?</p>
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Vault name" maxLength={128} />
      <Input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Vault symbol" maxLength={32} className="w-1/2" />
    </div>
  </div>
}

export default function VaultForm({ className }: { className?: string }) {
  const { address, chain } = useAccount()
  const { assetValidation, profitMaxUnlockTimeValidation } = useVaultFormValidation()

  return <div className={cn('pb-96 flex flex-col gap-24', className)}>
    <div className="flex flex-col gap-2">
      <p>Let's go!</p>
      <Input value={`Network: ${chain?.name}`} disabled />
      <Input value={`Role manager: ${address}`} disabled />
    </div>

    <Step1 />

    {assetValidation.isValid && <FlyInFromBottom _key="step2">
      <Step2 />
    </FlyInFromBottom>}

    {assetValidation.isValid && profitMaxUnlockTimeValidation.isValid && <FlyInFromBottom _key="step3">
      <Step3 />
    </FlyInFromBottom>}

    {assetValidation.isValid && <FlyInFromBottom _key="action">
      <Suspense>
        <Actions />
      </Suspense>
    </FlyInFromBottom>}
  </div>
}
