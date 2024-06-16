export default function Section({
  className, children
}: {
  className?: string,
  children: React.ReactNode
}) {
  return <div className={`p-8 border border-neutral-900 rounded-primary ${className}`}>
    {children}
  </div>
}
