export default function Wordmark({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={`
  tracking-tighter font-[900]
  font-fancy ${className}`}>
    {children}
  </div>
}
