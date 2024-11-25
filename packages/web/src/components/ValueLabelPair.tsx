export default function ValueLabelPair({ value, label, className }: { value: string | number | undefined, label: string, className?: string }) {
  return <div className="flex items-baseline gap-2">
    <div className={`whitespace-nowrap ${className}`}>{value}</div>
    <div className="text-sm">{label}</div>
  </div>
}
