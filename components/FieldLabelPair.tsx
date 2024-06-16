export default function FieldLabelPair({ 
  label, className, children 
}: { 
  label: string, className?: string, children: React.ReactNode
}) {
  return <div className="flex flex-col gap-2">
    <div className="px-2 text-neutral-400">{label}</div>
    {children}
  </div>
}
