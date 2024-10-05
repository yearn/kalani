import { ImgHTMLAttributes, useMemo, useState } from 'react'
import { cn } from '../lib/shadcn'

interface ImgOrBg extends ImgHTMLAttributes<HTMLImageElement> {
  bgClassName?: string,
	children?: React.ReactNode
}

export default function ImgOrBg({ bgClassName, children, ...imageProps }: ImgOrBg) {
	const [loaded, setLoaded] = useState(false)
	const imageClassName = useMemo(() => (loaded ? 'block' : 'hidden'), [loaded])
	const bgClassNameInner = useMemo(() => (loaded ? 'hidden' : 'block'), [loaded])
	return (
		<div className={cn('relative', `w-[${imageProps.width}px]`, `h-[${imageProps.height}px]`)}>
			<div
				title={imageProps.alt}
				className={cn(
					`absolute z-10 inset-0 w-[${imageProps.width}px]`,
					`h-[${imageProps.height}px]`,
					bgClassName,
					bgClassNameInner
				)}>{children}</div>
			<img
				{...imageProps}
				alt={imageProps.alt ?? ''}
				onLoad={() => setLoaded(true)}
				className={cn('absolute z-20 inset-0', imageProps.className, imageClassName)}
			/>
		</div>
	)
}
