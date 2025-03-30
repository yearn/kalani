import { useCallback, useMemo, useRef, useState } from 'react'
import { cn } from '../../lib/shadcn'
import { InputClassName } from './Input'
import { parseInputNumberString } from '@kalani/lib/strings'
import FlyInFromBottom from '../motion/FlyInFromBottom'

export function InputTokenAmount({
	amount,
	symbol,
	onChange,
	maxable,
	disabled,
	className
}: {
	amount?: string | undefined,
	symbol: string,
	onChange?: (amount: string | undefined) => void,
	maxable?: boolean,
	disabled?: boolean,
	className?: string
}) {
	const inputRef = useRef<HTMLInputElement>(null)

	const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(parseInputNumberString(e.target.value))
	}, [onChange])

	const onClickSymbol = useCallback(() => {
		inputRef.current?.focus()
		inputRef.current?.select()
	}, [inputRef])

	const onClickMax = useCallback(() => {
		onChange?.('MAX')
	}, [onChange])

	const [hovered, setHovered] = useState(false)
	const [focused, setFocused] = useState(false)
	const showMaxButton = useMemo(() => {
		return maxable && (hovered || focused)
	}, [maxable, hovered, focused])

  return <div 
		data-disabled={disabled} 
		className={cn(InputClassName, className, 'group flex items-center justify-between gap-2')}
		onMouseEnter={() => setHovered(true)}
		onMouseLeave={() => setHovered(false)}
		>
		<input
			ref={inputRef}
			disabled={disabled}
			data-disabled={disabled}
			className={`w-full truncate 
				bg-transparent text-lg
				placeholder:text-neutral-500

				group-hover:text-secondary-50 group-hover:border-secondary-50
				group-has-[:focus]:text-secondary-400 group-has-[:focus]:border-secondary-400
				focus:text-secondary-400 focus:border-secondary-400

				data-[disabled=true]:text-neutral-400
				group-hover:data-[disabled=true]:text-neutral-400 group-hover:data-[disabled=true]:border-black
				data-[disabled=true]:placeholder-neutral-800 data-[disabled=true]:border-transparent

				outline-none focus:ring-0 focus:outline-none`}
			inputMode="decimal"
			autoComplete="off"
			autoCorrect="off"
			type="text"
			pattern="^[0-9]*[.,]?[0-9]*$"
			placeholder="0"
			spellCheck="false"
			onChange={_onChange}
			onFocus={() => setFocused(true)}
			onBlur={() => setFocused(false)}
			value={amount}
		/>

    {!showMaxButton && <div onClick={onClickSymbol} className={cn(`
      flex items-center justify-end
			font-bold text-lg text-neutral-500
      pointer-pointer`)}>
			{symbol}
    </div>}

		{showMaxButton && <FlyInFromBottom _key="max-button">
			<button type="button" onClick={onClickMax} className={cn(`
				my-[-20px] px-3 py-1
				bg-neutral-900 border-primary border-neutral-900
				text-sm text-secondary-100
				hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
				active:text-secondary-400 active:border-secondary-400 active:bg-black
				rounded-full cursor-pointer pointer-events-auto`,
				hovered && 'text-secondary-50',
				focused && 'text-secondary-400')}>
				MAX
			</button>
		</FlyInFromBottom>}

  </div>
}
