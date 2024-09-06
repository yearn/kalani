import Button from '../../../components/elements/Button'
import { PiTractorFill } from 'react-icons/pi'

export default function Account() {
  return <div>
    <div className="flex flex-col items-center justify-center gap-12">
      <Button theme="cta" className="w-full flex items-center gap-3">
        <PiTractorFill size={24} />
        <span>Create your first yVault</span>
      </Button>
    </div>
  </div>
}
