import { EvmAddress } from '@kalani/lib/types'
import { KONG_API_HEADERS } from '../headers'

const KONG_API = process.env.KONG_API

async function addJob(queueName: string, jobName: string, data: any, options?: any) {
  const response = await fetch(`${KONG_API}/mq/add`, {
    method: 'POST',
    headers: { ...KONG_API_HEADERS },
    body: JSON.stringify({ queueName, jobName, data, options })
  })
  if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }
  return await response.json()
}

async function getJob(queueName: string, jobId: string) {
  const response = await fetch(`${KONG_API}/mq/job?queueName=${queueName}&jobId=${jobId}`, {
    headers: { ...KONG_API_HEADERS }
  })
  if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }
  return await response.json()
}

async function waitForJobToFinishOrFail(queueName: string, jobId: string) {
  while (true) {
    const job = await getJob(queueName, jobId)
    const failedReason = job.failedReason
    const finishedOn = Number(job.finishedOn ?? 0)
    if (failedReason || finishedOn > 0) return job
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

export async function postThing(chainId: number, address: EvmAddress, label: string, defaults: any) {
  const result = await addJob(
    'load', 'thing', 
    { chainId, address, label, defaults }, 
    { priority: 1 }
  )
  const { queueName, jobId } = result
  return await waitForJobToFinishOrFail(queueName, jobId)
}

export async function extractSnapshot(abiPath: string, chainId: number, address: EvmAddress) {
  const { queueName, jobId } = await addJob(
    `extract-${chainId}`, 'snapshot', 
    { abi: { abiPath }, source: { chainId, address, inceptBlock: 0 } }, 
    { priority: 1 }
  )
  return await waitForJobToFinishOrFail(queueName, jobId)
}

export async function extractLogs(abiPath: string, chainId: number, address: EvmAddress, from: bigint, to: bigint) {
  const { queueName, jobId } = await addJob(
    `extract-${chainId}`, 'evmlog', 
    { abiPath, chainId, address, from, to }, 
    { priority: 1 }
  )
  return await waitForJobToFinishOrFail(queueName, jobId)
}
