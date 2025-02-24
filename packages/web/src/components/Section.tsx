export default function Section({
  className, children
}: {
  className?: string,
  children: React.ReactNode
}) {
  return <div className={`sm:mx-8 px-4 sm:px-10 2xl:px-[14%] py-8 sm:py-12 
    border-primary border-transparent sm:border-black border-t-black
    first:border-t-transparent sm:first:border-t-black
    rounded-primary ${className}`}>
    {children}
  </div>
}
