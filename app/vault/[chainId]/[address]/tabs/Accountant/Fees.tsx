import FieldLabelPair from '@/components/FieldLabelPair'
import Section from '@/components/Section'
import Button from '@/components/elements/Button'
import Input from '@/components/elements/Input'
import abis from '@/lib/abis'
import { EvmAddress } from '@/lib/types'
import { useReadContract } from 'wagmi'

export default function Fees({
  vault,
  accountant
}: {
  vault: EvmAddress,
  accountant: EvmAddress
}) {
  const defaultConfig = useReadContract({
    address: accountant,
    abi: abis.accountant,
    functionName: 'defaultConfig'
  })

  const [
    managementFee, 
    performanceFee,
    refundRatio,
    maxFee,
    maxGain,
    maxLoss
  ] = defaultConfig.data ?? [0, 0, 0, 0, 0, 0]

  return <Section className="flex flex-col gap-6">
    <h2>Fees</h2>
    <div className="grid grid-cols-3 gap-6">
      <FieldLabelPair label="Management Fee">
        <Input value={managementFee} type="number" min={0} max={10_000} />
      </FieldLabelPair>

      <FieldLabelPair label="Performance Fee">
        <Input value={performanceFee} type="number" min={0} max={10_000} />
      </FieldLabelPair>

      <FieldLabelPair label="Max Fee">
        <Input value={maxFee} type="number" min={0} max={10_000} />
      </FieldLabelPair>

      <FieldLabelPair label="Refund Ratio">
        <Input value={refundRatio} type="number" min={0} max={10_000} />
      </FieldLabelPair>

      <FieldLabelPair label="Max Gain">
        <Input value={maxGain} type="number" min={0} max={10_000} />
      </FieldLabelPair>

      <FieldLabelPair label="Max Loss">
        <Input value={maxLoss} type="number" min={0} max={10_000} />
      </FieldLabelPair>
    </div>
    <div className="flex justify-end">
      <Button className="w-field-btn h-field-btn">Update</Button>
    </div>

  </Section>
}
