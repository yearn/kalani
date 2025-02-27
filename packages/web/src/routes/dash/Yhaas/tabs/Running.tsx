import { Suspense, useMemo } from 'react'
import Section from '../../../../components/Section'
import Skeleton from '../../../../components/Skeleton'
import { useYhaasIssues } from '../useYhaasIssues'
import LinkButton from '../../../../components/elements/LinkButton'
import { PiGithubLogoFill } from 'react-icons/pi'

function fIssueTitle(title: string) {
  const [result] = title.split(' [')
  return result
}

function Suspender() {
  const { issues } = useYhaasIssues()
  const running = useMemo(() => {
    return issues?.filter(issue => issue.labels.includes('running'))
  }, [issues])

  if (running?.length === 0) {
    return <Section className="flex items-center justify-center">
      You have no running yHaaS automations
    </Section>
  }

  return <div className="-mt-8 p-3 flex flex-col gap-3">
    {running?.map(issue => <LinkButton
      key={issue.number}
      to={issue.html_url}
      target="_blank" 
      rel="noopener noreferrer"
      h="tertiary"
      className="py-12 grow flex items-center justify-start text-3xl">
        <PiGithubLogoFill size={48} className="mr-6 sm:ml-8 sm:mr-12" />
        <div className="max-w-full truncate">{fIssueTitle(issue.title)}</div>
      </LinkButton>)}
  </div>
}

function _Skeleton() {
  return <div className="-mt-8 p-3 flex flex-col gap-3">
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
    <Skeleton className="w-full h-24 rounded-primary" />
  </div>
}

export default function Vitals() {
  return <Suspense fallback={<_Skeleton />}>
    <Suspender />
  </Suspense>
}
