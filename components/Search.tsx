import { useCallback, useRef, useState } from 'react'
import Input from './controls/Input'
import { PiKeyReturnFill } from 'react-icons/pi'
import useKeypress from 'react-use-keypress'

export default function Search({ onSearch, className }: { onSearch?: (q: string) => void, className?: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [showEnter, setShowEnter] = useState(false)
  const onSlash = useCallback(() => setTimeout(() => ref.current?.focus(), 0), [ref])
  const onEnter = useCallback(() => onSearch?.(ref.current?.value || ''), [ref, onSearch])
  useKeypress('/', onSlash)
  useKeypress('Enter', onEnter)

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setShowEnter(e.target.value.length > 0)
  }, [setShowEnter])

  return <div className={`relative ${className}`}>
    <Input ref={ref} type="text" onChange={onChange} placeholder={'Search by address'} className="w-full" />
    {!showEnter && <div className={`
      absolute top-0 right-4 h-full flex items-center text-neutral-800`}>/</div>}
    {showEnter && <div className={`
      absolute top-0 right-4 h-full flex items-center text-neutral-800`}>
      <PiKeyReturnFill />
    </div>}
  </div>
}
