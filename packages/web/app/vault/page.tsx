
function ValueLabelPair({ value, label, className }: { value: string, label: string, className?: string }) {
  return <div className="flex items-baseline gap-2">
    <div className={className}>{value}</div>
    <div className="text-sm">{label}</div>
  </div>
}

export default function Vault() {
  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem] pb-96
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full p-12 flex gap-8 border border-neutral-800 rounded">
      <div className="w-2/3 flex flex-col gap-2">
        <div className="text-5xl">USDC yVault-A</div>
        <div className="flex items-center gap-12">
          <ValueLabelPair value="1.08M" label="tvl" className="text-3xl" />
          <ValueLabelPair value="27.03%" label="apy" className="text-3xl" />
        </div>
      </div>
      <div className="w-1/3 flex flex-col justify-center">
        <div className="flex items-center gap-12">
          <div className="">Latest harvest</div>
          <div className="text-orange-300">2 weeks ago !!</div>
        </div>
        <div className="mt-4 text-lg">Aave Lender v3 USDC</div>
        <div className="flex items-center gap-12">
          <ValueLabelPair value="330.02" label="gain" className="text-2xl" />
          <ValueLabelPair value="16.08%" label="apr" className="text-2xl" />
        </div>
      </div>
    </div>
  </main>
}
