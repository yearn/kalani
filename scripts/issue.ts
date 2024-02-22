import jwt from 'jsonwebtoken'

const appId = Number(process.env.GITHUB_APP_ID || 0)
const pk = process.env.GITHUB_APP_PRIVATE_KEY || ''
const installationId = Number(process.env.GITHUB_APP_INSTALLATION_ID || 0)
const owner = process.env.GITHUB_APP_REPO_OWNER || ''
const repo = process.env.GITHUB_APP_REPO_NAME || ''
const ghApiVersion = process.env.GITHUB_API_VERSION || '2022-11-28'

async function main() {
  const now = Math.floor(Date.now() / 1000)
  const thirtySecondsAgo = now - 30
  const tenMinutes = 60 * 10
  const expiration = thirtySecondsAgo + tenMinutes

  const appToken = jwt.sign({ 
    iat: thirtySecondsAgo, exp: expiration, iss: appId 
  }, pk, { algorithm: 'RS256' })

  console.log('appToken', appToken)

  const installationTokenResponse = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${appToken}`,
        'X-GitHub-Api-Version': ghApiVersion,
      },
    }
  )

  const installationToken = await installationTokenResponse.json()
  console.log('installationToken', installationToken)

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`, 
    {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${installationToken.token}`,
        'X-GitHub-Api-Version': ghApiVersion,
      },
      body: JSON.stringify({
        title: 'Issue!!',
        body: '"issues" lol',
        assignees: [],
        labels: [],
      })
    }
  )

  console.log(await response.json())
}

main()
