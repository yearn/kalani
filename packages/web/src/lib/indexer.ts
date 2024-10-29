import { EvmAddress } from '@kalani/lib/types'
import { useMutation } from '@tanstack/react-query'
import { API_URL } from './env'

async function addJob(queueName: string, jobName: string, data: any, options?: any) {
  const response = await fetch(`${API_URL}/api/kong/mq/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queueName, jobName, data, options })
  })
  if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }
  return await response.json()
}

async function getJob(queueName: string, jobId: string) {
  const response = await fetch(`${API_URL}/api/kong/mq/job?queueName=${queueName}&jobId=${jobId}`, {
    headers: { 'Content-Type': 'application/json' }
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

export function usePostThing(args: { chainId: number, address: EvmAddress, label: string, defaults: any }) {
  return useMutation({
    mutationKey: ['postThing', args],
    mutationFn: () => postThing(args.chainId, args.address, args.label, args.defaults)
  })
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
