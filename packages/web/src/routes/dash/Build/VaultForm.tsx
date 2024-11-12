import { useAccount } from 'wagmi'
import Input from '../../../components/elements/Input'
import StepLabel from '../../../components/forms/StepLabel'
import SelectErc20 from '../../../components/SelectErc20'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import FlyInFromBottom from '../../../components/motion/FlyInFromBottom'
import { Suspense } from 'react'
import Actions from './Actions'
import { cn } from '../../../lib/shadcn'
import SelectProject, { useSelectedProject } from '../../../components/SelectProject'
import { zeroAddress } from 'viem'
import InputInteger from './InputInteger'
import ProjectChipSlide from '../../../components/ChipSlide/ProjectClipSlide'

function Step_Project() {
  const { selectedProject, setSelectedProject } = useSelectedProject()
  return <div className="flex items-start gap-12">
    <StepLabel step={1} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Select a project</p>
      <SelectProject navkey="step_project" onSelect={setSelectedProject} />
      <div>
        {selectedProject && <ProjectChipSlide
          chainId={selectedProject?.chainId ?? 1}
          id={selectedProject?.id ?? zeroAddress}
          className="bg-neutral-600"
        />}
      </div>
    </div>
  </div>
}

function Step_Token() {
  const { chain } = useAccount()
  const { asset, setAsset } = useVaultFormData()
  return <div className="flex items-start gap-12">
    <StepLabel step={2} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">What asset (erc20 token) will your vault hold?</p>
      <SelectErc20 chainId={chain?.id} placeholder="Find asset by name or address" selected={asset} onSelect={setAsset} />
    </div>
  </div>
}

function Step_Category() {
  const { category, setCategory } = useVaultFormData()
  const { categoryValidation } = useVaultFormValidation()
  return <div className="flex items-start gap-12">
    <StepLabel step={3} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">What category does your vault fall under?</p>
      <InputInteger value={category} 
        onChange={e => setCategory(Number(e.target.value))} 
        isValid={categoryValidation.isValid}
        validationMessage={categoryValidation.message}
      />
    </div>
  </div>
}

function Step_Name() {
  const { name, setName, symbol, setSymbol } = useVaultFormData()
  return <div className="flex items-start gap-12">
    <StepLabel step={4} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">What's your vault's name and symbol?</p>
      <Input value={name} onChange={e => setName(e.target.value)} placeholder="Vault name" maxLength={128} />
      <Input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="Vault symbol" maxLength={32} className="w-1/2" />
    </div>
  </div>
}

export default function VaultForm({ className }: { className?: string }) {
  const { projectIdValidation, assetValidation, categoryValidation } = useVaultFormValidation()

  return <div className={cn('pb-96 flex flex-col gap-24', className)}>
    <Step_Project />

    {projectIdValidation.isValid && <FlyInFromBottom _key="step_token">
      <Step_Token />
    </FlyInFromBottom>}

    {projectIdValidation.isValid && assetValidation.isValid && <FlyInFromBottom _key="step_category">
      <Step_Category />
    </FlyInFromBottom>}

    {projectIdValidation.isValid && assetValidation.isValid && categoryValidation.isValid && <FlyInFromBottom _key="step_name">
      <Step_Name />
    </FlyInFromBottom>}

    {projectIdValidation.isValid && <FlyInFromBottom _key="action">
      <Suspense>
        <Actions />
      </Suspense>
    </FlyInFromBottom>}
  </div>
}
