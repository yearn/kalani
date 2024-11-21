export default function Section({
  className, children
}: {
  className?: string,
  children: React.ReactNode
}) {
  return <section className={`px-10 xl:px-24 py-12 border-primary border-neutral-900 rounded-primary ${className}`}>
    {children}
  </section>
}
