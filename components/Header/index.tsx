import Connect from '../Connect'
import Home from './Home'

function Header() {
	return <header className="fixed inset-x-0 top-0 z-50 w-full backdrop-blur">
		<div className="mx-auto max-w-6xl h-20 flex items-center justify-between">
			<div className="flex w-1/3 justify-start">
				<Home />
			</div>
			<div className="flex w-1/3 justify-start">
			</div>
			<div className="flex w-1/3 items-center justify-end">
				<div className="p-2 bg-primary-1000/40 rounded-primary">
					<Connect className="py-2 text-sm" />
				</div>
			</div>
		</div>
	</header>
}

export default Header
