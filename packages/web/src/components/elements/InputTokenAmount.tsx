import { useCallback, useRef } from 'react'
import { cn } from '../../lib/shadcn'
import { InputClassName } from './Input'

export function InputTokenAmount({
	amount,
	symbol,
	onChange,
	disabled,
	className
}: {
	amount?: string | undefined,
	symbol: string,
	onChange?: (amount: string | undefined) => void,
	disabled?: boolean,
	className?: string
}) {
	const inputRef = useRef<HTMLInputElement>(null)

	const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value)
	}, [onChange])

	const onClickSymbol = useCallback(() => {
		inputRef.current?.focus()
		inputRef.current?.select()
	}, [inputRef])

  return <div className={cn(InputClassName, className, 'group flex items-center justify-between gap-2')}>
		<input
			ref={inputRef}
			disabled={disabled}
			className={`w-full truncate 
				bg-transparent text-lg
				placeholder:text-neutral-500

				group-hover:text-secondary-50 group-hover:border-secondary-50
				group-has-[:focus]:text-secondary-400 group-has-[:focus]:border-secondary-400
				focus:text-secondary-400 focus:border-secondary-400

				disabled:text-neutral-400
				group-hover:disabled:text-neutral-400 group-hover:disabled:border-black
				disabled:placeholder-neutral-800 disabled:border-transparent

				outline-none focus:ring-0 focus:outline-none`}
			inputMode="decimal"
			autoComplete="off"
			autoCorrect="off"
			type="text"
			pattern="^[0-9]*[.,]?[0-9]*$"
			placeholder="0"
			spellCheck="false"
			onChange={_onChange}
			value={amount}
		/>
    <div onClick={onClickSymbol} className={cn(`
      flex items-center justify-end
			font-bold text-lg text-neutral-500
      pointer-pointer`)}>
			{symbol}
    </div>
  </div>
}
