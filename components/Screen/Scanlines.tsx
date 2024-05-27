export default function Scanlines() {
  return <div className={`
    absolute z-50 inset-0 pointer-events-none
    before:content-[' '] before:absolute before:inset-0 before:z-50
    before:bg-gradient-to-b before:from-transparent before:to-white before:opacity-[.015]
    before:bg-[size:100%_8px]
  `}></div>
}
