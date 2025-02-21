export default function Section({
  className, children
}: {
  className?: string,
  children: React.ReactNode
}) {
  return <div className={`sm:mx-8 px-4 sm:px-10 2xl:px-[14%] py-3 sm:py-12 
    border-primary border-transparent sm:border-neutral-900 
    rounded-primary ${className}`}>
    {children}
  </div>
}
