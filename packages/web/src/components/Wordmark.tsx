export default function Wordmark({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={`
  text-transparent bg-clip-text bg-clip-text
  bg-neutral-200
  tracking-tighter font-[900] drop-shadow-fancy
  font-fancy ${className}`}>
    {children}
  </div>
}
