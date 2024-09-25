import { useMemo } from 'react'
import A from '../../../components/elements/A'
import { useYhaasIssues } from '../Yhaas/useYhaasIssues'

function fIssueTitle(title: string) {
  const [result] = title.split(' [')
  return result
}

export default function Yhaas() {
  const { issues } = useYhaasIssues()
  const pending = useMemo(() => {
    return issues?.filter(issue => !issue.labels.includes('running'))
  }, [issues])

  const running = useMemo(() => {
    return issues?.filter(issue => issue.labels.includes('running'))
  }, [issues])

  return <div className="w-full flex flex-col items-start justify-center gap-12">
    <div className="flex flex-col items-start justify-center gap-2">
      <p className="text-neutral-500">Pending</p>
      <div className="flex flex-col items-start justify-center gap-3">
        {pending?.map((issue: any) => <div key={issue.number}>
          <div><A href={issue.html_url} target="_blank" rel="noopener noreferrer">{fIssueTitle(issue.title)}</A></div>
        </div>)}
      </div>
    </div>
    <div className="flex flex-col items-start justify-center gap-2">
      <p className="text-neutral-500">Running</p>
      <div className="flex flex-col items-start justify-center gap-3">
        {running?.map((issue: any) => <div key={issue.number}>
          <div><A href={issue.html_url} target="_blank" rel="noopener noreferrer">{fIssueTitle(issue.title)}</A></div>
        </div>)}
      </div>
    </div>
  </div>
}
