import Hero, { HeroInset, HeroIcon } from '../../../components/Hero'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { useProjectByParams } from './useProjectByParams'
import { Tab, TabContent, Tabs } from '../../../components/Tabs'
import Vitals from './tabs/Vitals'
import Vaults from './tabs/Vaults'
import { PiFolderSimple } from 'react-icons/pi'
import Fancy from '../../../components/Fancy'

const tabClassName = `
bg-green-400/20
text-green-400
data-[selected=true]:bg-green-400
hover:bg-green-400/40
active:bg-green-400/60
`

function Suspender() {
  const { project } = useProjectByParams()

  return <section className="flex flex-col">
    <Hero>
      <div className="flex items-center gap-6">
        <HeroIcon icon={PiFolderSimple} className="bg-green-400" />
        <Fancy text={project.name} />
      </div>
      <HeroInset>
        <Tabs className="w-full pb-3 pl-2 sm:pl-0">
          <Tab id="vitals" isDefault={true} className={tabClassName}>Vitals</Tab>
          <Tab id="vaults" className={tabClassName}>Vaults</Tab>
        </Tabs>
      </HeroInset>
    </Hero>

    <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
      <TabContent id="vitals" isDefault={true}><Vitals /></TabContent>
      <TabContent id="vaults"><Vaults /></TabContent>
    </div>
  </section>
}

function _Skeleton() {
  return <section className="flex flex-col gap-10">
    <Hero>
      <div className="flex items-center gap-6 drop-shadow-lg">
        <HeroIcon icon={PiFolderSimple} className="bg-green-600" />
        <div className="flex flex-col gap-0">
          <div className="flex items-end gap-1">
            <div className="text-4xl font-fancy"><Skeleton className="w-48 h-10 rounded-primary" /></div>
          </div>
        </div>
      </div>

      <HeroInset className="flex gap-4 pb-4">
        <Skeleton className="w-24 h-8 rounded-full" />
        <Skeleton className="w-24 h-8 rounded-full" />
      </HeroInset>
    </Hero>
  </section>
}

export default function Project() {
  return <Suspense fallback={<_Skeleton />}>
    <Suspender />
  </Suspense>
}
