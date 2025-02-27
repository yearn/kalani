import Hero, { HeroInset } from '../../../components/Hero'
import { Suspense } from 'react'
import Skeleton from '../../../components/Skeleton'
import { useProjectByParams } from './useProjectByParams'
import { Tab, TabContent, Tabs } from '../../../components/Tabs'
import Vitals from './tabs/Vitals'
import Vaults from './tabs/Vaults'

function Suspender() {
  const { project } = useProjectByParams()

  return <section className="flex flex-col">
    <Hero className="bg-indigo-400 text-neutral-950">
      <div className="flex flex-col justify-center gap-2 drop-shadow-lg">
        <div className="text-5xl font-bold">{project.name}</div>
      </div>

      <HeroInset>
        <Tabs className="w-full pb-3 pl-2 sm:pl-0">
          <Tab id="vitals" isDefault={true} className="text-black active:text-secondary-400 data-[selected=true]:text-secondary-400">Vitals</Tab>
          <Tab id="vaults" className="text-black active:text-secondary-400 data-[selected=true]:text-secondary-400">Vaults</Tab>
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
    <Hero className="bg-indigo-400 text-neutral-950">
      <div className="flex flex-col justify-center gap-2 drop-shadow-lg">
        <div><Skeleton className="w-48 h-12 rounded-primary" /></div>
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
