import { ImgHTMLAttributes, useMemo, useState } from 'react'
import { cn } from '../lib/shadcn'

interface ImgOrBg extends ImgHTMLAttributes<HTMLImageElement> {
  bgClassName?: string
}

export default function ImgOrBg({ bgClassName, ...imageProps }: ImgOrBg) {
	const [loaded, setLoaded] = useState(false)
	const imageClassName = useMemo(() => (loaded ? 'opacity-1' : 'opacity-0'), [loaded])
	const bgClassNameInner = useMemo(() => (loaded ? 'hidden' : 'block'), [loaded])

	return (
		<div className={cn('relative', `w-[${imageProps.width}px]`, `h-[${imageProps.height}px]`)}>
			<div
				className={cn(
					`absolute z-10 inset-0 w-[${imageProps.width}px]`,
					`h-[${imageProps.height}px]`,
					bgClassName,
					bgClassNameInner
				)}></div>
			<img
				{...imageProps}
				alt={imageProps.alt ?? ''}
				onLoad={() => setLoaded(true)}
				className={cn('absolute z-20 inset-0', imageProps.className, imageClassName)}
			/>
		</div>
	)
}
