export default function StepLabel({ step }: { step: number }) {
  return <span className="hidden sm:block font-mono font-bold text-6xl text-neutral-600">{step}</span>
}
