import { cloneElement, Fragment, useState } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import { APPS } from './HeaderPopover.apps'
import type { ReactElement } from 'react'
import { Y } from '../icons/Y'
import Scanlines from '../Screen/Scanlines'

function LogoPopover(): ReactElement {
	const [isShowing, set_isShowing] = useState(false)

	return (
		<Popover
			onMouseEnter={(): void => set_isShowing(true)}
			onMouseLeave={(): void => set_isShowing(false)}
			className={'group relative'}>
			<Popover.Button className={'flex items-center'}>
				<Link href={'/'}>
					<span className={'sr-only'}>{'Back to home'}</span>
          <Y className={`w-9 h-9 
						border border-transparent 
						bg-orange-950 text-neutral-0
						group-hover:bg-neutral-900 group-hover:text-violet-300 group-hover:border-violet-300
						group-active:text-violet-400 group-active:border-violet-400`} />
				</Link>
			</Popover.Button>
			<Transition
				as={Fragment}
				show={isShowing}
				enter={'transition ease-out duration-200'}
				enterFrom={'opacity-0 translate-y-1'}
				enterTo={'opacity-100 translate-y-0'}
				leave={'transition ease-in duration-150'}
				leaveFrom={'opacity-100 translate-y-0'}
				leaveTo={'opacity-0 translate-y-1'}>
				<Popover.Panel
					className={'absolute left-1/2 z-10 mt-0 w-80 -translate-x-1/2 px-4 pt-4 sm:px-0 md:w-96'}>
					<div className={'overflow-hidden border border-violet-300 group-active:border-violet-400 rounded shadow-lg'}>
						<div className={'relative grid grid-cols-2 bg-neutral-900 md:grid-cols-3'}>
							{Object.values(APPS).map(({name, href, icon}): ReactElement => {
								return (
									<Link
										prefetch={false}
										key={name}
										href={href}
										onClick={(): void => set_isShowing(false)}>
										<div
											onClick={(): void => set_isShowing(false)}
											className={
												'flex cursor-pointer flex-col items-center p-4 transition-colors hover:bg-violet-400/20'
											}>
											<div>{cloneElement(icon)}</div>
											<div className={'pt-2 text-center'}>
												<b className={'text-base'}>{name}</b>
											</div>
										</div>
									</Link>
								)
							})}
							<Scanlines />
						</div>
					</div>
				</Popover.Panel>
			</Transition>
		</Popover>
	)
}

export {LogoPopover}
