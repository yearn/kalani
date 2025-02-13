export default function Section({
  className, children
}: {
  className?: string,
  children: React.ReactNode
}) {
  return <section className={`px-4 sm:px-10 2xl:px-[14%] py-3 sm:py-12 
    border-primary border-transparent sm:border-neutral-900 
    rounded-primary ${className}`}>
    {children}
  </section>
}
