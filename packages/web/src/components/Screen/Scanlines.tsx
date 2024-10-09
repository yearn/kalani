export default function Scanlines({ className }: { className? : string }) {
  return <div className={`
    absolute z-50 inset-0 pointer-events-none rounded-primary
    before:content-[' '] before:absolute before:inset-0 before:z-50
    before:bg-gradient-to-b before:from-transparent before:to-white before:opacity-[.122]
    before:bg-[size:100%_10px]
    ${className ?? 'mix-blend-overlay'}
  `}></div>
}
