import Scanlines from './Scanlines'

export default function Screen({ 
  className, 
  scanlines, 
  onClick,
  children
}: { 
  className?: string, 
  scanlines?: boolean,
  onClick?: () => void,
  children?: React.ReactNode 
}) {
  return <div onClick={onClick} className={`
    relative
    ${className ?? 'bg-neutral-900 text-neutral-300'}`}>
    {children ?? <></>}
    {scanlines && <Scanlines />}
    <div className="absolute inset-0 pointer-events-none" />
  </div>
}
