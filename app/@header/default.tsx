import Connect from '@/components/Connect'
import Launcher from '@/components/Launcher'

export default function Slot() {
  return <header className="fixed z-50 inset-x-0 top-0 w-full">
    <div className="mx-auto max-w-6xl h-20 flex items-center justify-between">
      <div className="grow flex items-center justify-start gap-12"></div>
      <div className={`flex items-center justify-end gap-4`}>
        <Connect />
        <Launcher alignRight={true} />
      </div>
    </div>
  </header>
}
