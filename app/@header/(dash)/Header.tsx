import Launcher from '@/components/Launcher'
import Finder from '@/components/Finder'
import Connect from '@/components/Connect'
 
export default function Header() {
  return <header
    className={`sticky z-50 inset-x-0 top-0 w-full
    bg-black/60 backdrop-blur border-b border-primary-1000`}>
    <div className="mx-auto w-full h-20 pl-32 pr-6 flex items-center justify-between">
      <div className="grow flex items-center justify-start gap-12">
        <Finder
          className="w-[32rem]"
          inputClassName="px-4 py-2 border-transparent"
          placeholder="address / vault / token" />
      </div>
      <div className={`flex items-center justify-end gap-4`}>
        <Connect />
        <Launcher alignRight={true} />
      </div>
    </div>
  </header>
}
