import jwt from 'jsonwebtoken'

const appId = Number(process.env.GITHUB_APP_ID || 0)
const pk = process.env.GITHUB_APP_PRIVATE_KEY || ''
const installationId = Number(process.env.GITHUB_APP_INSTALLATION_ID || 0)
const owner = process.env.GITHUB_APP_REPO_OWNER || ''
const repo = process.env.GITHUB_APP_REPO_NAME || ''
const ghApiVersion = process.env.GITHUB_API_VERSION || '2022-11-28'

function appToken() {
  const now = Math.floor(Date.now() / 1000)
  const thirtySecondsAgo = now - 30
  const tenMinutes = 60 * 10
  const expiration = thirtySecondsAgo + tenMinutes
  return jwt.sign({ 
    iat: thirtySecondsAgo, exp: expiration, iss: appId 
  }, pk, { algorithm: 'RS256' })
}

export async function fetchInstallationToken() {
  const installationTokenResponse = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${appToken()}`,
        'X-GitHub-Api-Version': ghApiVersion,
      },
    }
  )
  return (await installationTokenResponse.json()).token as string
}

export async function postIssue(title: string, body: string, labels: string[]) : Promise<{
  url: string
  html_url: string
  labels: string[]
  state: string
}> {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`, 
    { method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${await fetchInstallationToken()}`,
        'X-GitHub-Api-Version': ghApiVersion,
      },
      body: JSON.stringify({ title, body, assignees: [], labels })
    }
  )

  const json = await response.json()

  return {
    url: json.url,
    html_url: json.html_url,
    labels: json.labels.map((l: any) => l.name),
    state: json.state
  }
}

export async function fetchIssue(url: string, installationToken?: string) : Promise<{
  url: string
  html_url: string
  labels: string[]
  state: string
}> {
  if(!installationToken) installationToken = await fetchInstallationToken()
  const response = await fetch(
    url,
    { method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${installationToken}`,
        'X-GitHub-Api-Version': ghApiVersion,
      }
    }
  )

  const json = await response.json()

  return {
    url: json.url,
    html_url: json.html_url,
    labels: json.labels.map((l: any) => l.name),
    state: json.state
  }
}

export async function fetchOpenIssues(page: number = 1, perPage: number = 30): Promise<{
  url: string
  html_url: string
  labels: string[]
  state: string
  title: string
  number: number
}[]> {
  const installationToken = await fetchInstallationToken()
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues?state=open&page=${page}&per_page=${perPage}`,
    {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${installationToken}`,
        'X-GitHub-Api-Version': ghApiVersion,
      }
    }
  )

  const json = await response.json()

  return json.map((issue: any) => ({
    url: issue.url,
    html_url: issue.html_url,
    labels: issue.labels.map((l: any) => l.name),
    state: issue.state,
    title: issue.title,
    number: issue.number
  }))
}

export async function fetchAllOpenIssues(limit: number = 100): Promise<{
  url: string
  html_url: string
  labels: string[]
  state: string
  title: string
  number: number
}[]> {
  let allIssues: ReturnType<typeof fetchOpenIssues> extends Promise<infer T> ? T : never = [];
  let page = 1;
  const perPage = 100; // Maximum allowed by GitHub API

  while (allIssues.length < limit) {
    const issues = await fetchOpenIssues(page, perPage);
    allIssues = allIssues.concat(issues);

    if (issues.length < perPage) {
      break; // No more issues to fetch
    }

    page++;
  }

  return allIssues.slice(0, limit);
}
