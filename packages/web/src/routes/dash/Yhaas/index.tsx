import { PiRobot } from 'react-icons/pi'
import Apply from './tabs/Apply'
import Hero, { HeroInset } from '../../../components/Hero'
import { Tab, TabContent, Tabs } from '../../../components/Tabs'
import Vitals from './tabs/Vitals'
import Pending from './tabs/Pending'
import Running from './tabs/Running'
import Fancy from '../../../components/Fancy'
import { HeroIcon } from '../../../components/Hero'

const tabClassName = `
bg-zinc-400/20
data-[selected=true]:bg-zinc-400
hover:bg-zinc-400/40
active:bg-zinc-400/60
`

function Brand() {
  return <div className="flex items-center gap-6 drop-shadow-lg">
    <HeroIcon icon={PiRobot} className="bg-zinc-400" />
    <div className="flex flex-col gap-0">
      <Fancy text="yHaaS" />
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
  return <section className="flex flex-col gap-8">
    <Hero>
      <Brand />
      <HeroInset>
        <Tabs className="w-full pb-3 pl-2 sm:pl-0">
          <Tab id="vitals" className={tabClassName}>Vitals</Tab>
          <Tab id="apply" className={tabClassName} isDefault={true}>Apply</Tab>
          <Tab id="pending" className={tabClassName}>Pending</Tab>
          <Tab id="running" className={tabClassName}>Running</Tab>
        </Tabs>
      </HeroInset>
    </Hero>
    <Content />
  </section>
}
