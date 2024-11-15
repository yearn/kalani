import { useAccount } from 'wagmi'
import Input from '../../../components/elements/Input'
import StepLabel from '../../../components/forms/StepLabel'
import SelectErc20 from '../../../components/SelectErc20'
import { useVaultFormData, useVaultFormValidation } from './useVaultForm'
import FlyInFromBottom from '../../../components/motion/FlyInFromBottom'
import { Suspense, useMemo } from 'react'
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

const categoryClassNames: Record<number, string> = {
  [1]: `hover:border-green-900 hover:text-green-500
    data-[selected=true]:border-green-900 data-[selected=true]:bg-green-900 data-[selected=true]:text-green-500
    active:border-green-950 active:text-green-800`,
  [2]: `hover:border-yellow-900 hover:text-yellow-500
    data-[selected=true]:border-yellow-900 data-[selected=true]:bg-yellow-900 data-[selected=true]:text-yellow-500
    active:border-yellow-950 active:text-yellow-800`,
  [3]: `hover:border-red-900 hover:text-red-500
    data-[selected=true]:border-red-900 data-[selected=true]:bg-red-900 data-[selected=true]:text-red-500
    active:border-red-950 active:text-red-800`,
}

function CategoryChip({ category, label }: { category: number, label: string }) {
  const { category: selectedCategory, setCategory } = useVaultFormData()
  const selected = useMemo(() => selectedCategory === category, [selectedCategory, category])
  return <div onClick={() => setCategory(category)} data-selected={selected} className={cn(
    `px-6 py-2 border-primary border-neutral-900 bg-neutral-900
    text-neutral-600 text-lg font-bold rounded-full cursor-pointer`, 
    categoryClassNames[category])}>
    {label}
  </div>
}

function Step_Category() {
  return <div className="flex items-start gap-12">
    <StepLabel step={3} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">What's your vault's risk category?</p>
      <div className="flex items-center gap-4">
        <CategoryChip category={1} label="Safe" />
        <CategoryChip category={2} label="Risky" />
        <CategoryChip category={3} label="Degen" />
      </div>
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
