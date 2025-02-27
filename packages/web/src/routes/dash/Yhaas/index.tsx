import { PiRobot } from 'react-icons/pi'
import Apply from './tabs/Apply'
import Hero, { HeroInset } from '../../../components/Hero'
import { Tab, TabContent, Tabs } from '../../../components/Tabs'
import Vitals from './tabs/Vitals'
import Pending from './tabs/Pending'
import Running from './tabs/Running'

function Brand() {
  return <div className="flex items-center gap-6 drop-shadow-lg">
    <PiRobot size={64} />
    <div className="flex flex-col gap-0">
      <div className="flex items-end gap-1">
        <div className="text-4xl font-fancy">y</div>
        <div className="text-5xl font-fancy">H</div>
        <div className="text-4xl font-fancy">aa</div>
        <div className="text-5xl font-fancy">S</div>
      </div>
      <div className="text-xs tracking-widest">Yearn Harvest as a Service</div>
    </div>
  </div>
}

function Content() {
  return <div className="w-full sm:px-4 sm:py-8 flex flex-col sm:gap-8">
    <TabContent id="vitals"><Vitals /></TabContent>
    <TabContent id="apply" isDefault={true}><Apply /></TabContent>
    <TabContent id="pending"><Pending /></TabContent>
    <TabContent id="running"><Running /></TabContent>
  </div>
}

export default function Page() {
  const tabClassName = 'text-black active:text-zinc-400 data-[selected=true]:text-zinc-400'
  return <section className="flex flex-col gap-8">
    <Hero className="text-neutral-950 bg-zinc-400">
      <Brand />
      <HeroInset>
        <Tabs className="w-full pb-3 pl-2 sm:pl-0">
          <Tab id="vitals" className={tabClassName}>Vitals</Tab>
          <Tab id="apply" isDefault={true} className={tabClassName}>Apply</Tab>
          <Tab id="pending" className={tabClassName}>Pending</Tab>
          <Tab id="running" className={tabClassName}>Running</Tab>
        </Tabs>
      </HeroInset>
    </Hero>
    <Content />
  </section>
}
