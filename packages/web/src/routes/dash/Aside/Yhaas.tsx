import A from '../../../components/elements/A'
import { useYHaaSIssues } from '../Yhaas/useYhaasIssues'

function fIssueTitle(title: string) {
  const [result] = title.split(' [')
  return result
}

export default function Yhaas() {
  const { accountsIssues } = useYHaaSIssues()

  return <div className="flex flex-col items-start justify-center gap-12">
    <div>
      <p className="text-neutral-500">Unregistered</p>
      <div className="flex flex-col items-center justify-center gap-12"></div>
    </div>
    <div>
      <p className="text-neutral-500">Pending</p>
      <div className="flex flex-col items-center justify-center gap-12">
        {accountsIssues?.map((issue: any) => <div key={issue.number}>
          <div><A href={issue.html_url} target="_blank" rel="noopener noreferrer">{fIssueTitle(issue.title)}</A></div>
        </div>)}
      </div>
    </div>
    <div>
      <p className="text-neutral-500">Whitelisted</p>
      <div className="flex flex-col items-center justify-center gap-12"></div>
    </div>
  </div>
}
