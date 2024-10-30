if (!BigInt.prototype.hasOwnProperty('toJSON')) {
  Object.defineProperty(BigInt.prototype, 'toJSON', {
    get() {
      'use strict'
      return () => String(this)
    }
  })
}

import { EvmAddress } from '@kalani/lib/types'
import { createTestnetClient, TestnetClient } from '@kalani/lib/tenderly'
import { polygon, type Chain } from 'viem/chains'
import { getContract, parseEther, zeroAddress } from 'viem'
import abis from '@kalani/lib/abis'
import { compareEvmAddresses } from '@kalani/lib/strings'

const ROLE_MANAGER_FACTORY: EvmAddress = '0xca12459a931643BF28388c67639b3F352fe9e5Ce'
const ALICE: EvmAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'

async function getJob(queueName: string, jobId: string) {
  const response = await fetch(`${process.env.KONG_API}/mq/job?queueName=${queueName}&jobId=${jobId}`, {
    headers: { 'Content-Type': 'application/json', auth: process.env.KONG_API_AUTH ?? '' }
  })
  return response.json()
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

async function addJob(queueName: string, jobName: string, data: any, options?: any) {
  const response = await fetch(`${process.env.KONG_API}/mq/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', auth: process.env.KONG_API_AUTH ?? '' },
    body: JSON.stringify({ queueName, jobName, data, options })
  })
  const { jobId } = await response.json()
  return { queueName, jobId }
}

async function projectExists(client: TestnetClient, name: string, governance: EvmAddress) {
  const roleManagerFactory = getContract({ abi: abis.roleManagerFactory, address: ROLE_MANAGER_FACTORY, client })  
  const projectId = await roleManagerFactory.read.getProjectId([name, governance])
  const [roleManager] = await roleManagerFactory.read.projects([projectId])
  return !compareEvmAddresses(roleManager, zeroAddress)
}

async function waitForBlock(client: TestnetClient, blockNumber: bigint, timeoutSeconds = 30) {
  const startTime = Date.now()
  while (true) {
    const { number } = await client.getBlock()
    if (number >= blockNumber) break

    const elapsedTime = Date.now() - startTime
    if (elapsedTime >= (timeoutSeconds * 1000)) {
      throw new Error('Timeout exceeded while waiting for block')
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

async function createProject(client: TestnetClient, name: string, governance: EvmAddress) {
  const roleManagerFactory = getContract({ abi: abis.roleManagerFactory, address: ROLE_MANAGER_FACTORY, client })  
  const projectId = await roleManagerFactory.read.getProjectId([name, governance])

  const newProjectTxHash = await roleManagerFactory.write.newProject([name, governance, governance], { account: governance })
  const [roleManager, registry, accountant, debtAllocator] = await roleManagerFactory.read.projects([projectId])
  console.log('👹', 'roleManager, registry, accountant, debtAllocator', roleManager, registry, accountant, debtAllocator)

  const newProjectTx = await client.getTransaction({ hash: newProjectTxHash })
  const { number: inceptBlock, timestamp: inceptTime } = await client.getBlock({ blockNumber: newProjectTx.blockNumber })

  await waitForBlock(client, inceptBlock)

  const loadThingTx = await addJob('load', 'thing', {
    chainId: client.chain.id, address: roleManager, label: 'roleManager',
    defaults: { roleManagerFactory: roleManagerFactory.address, project: { id: projectId }, inceptBlock, inceptTime }
  }, { priority: 1 })

  await waitForJobToFinishOrFail(loadThingTx.queueName, loadThingTx.jobId)
  console.log('👹', 'loadThing', 'done')

  const extractRoleManagerSnapshotTx = await addJob(`extract-${client.chain.id}`, 'snapshot', {
    abi: { abiPath: 'yearn/3/roleManager' }, 
    source: { chainId: client.chain.id, address: roleManager, inceptBlock: 0 }
  }, { priority: 1 })

  await waitForJobToFinishOrFail(extractRoleManagerSnapshotTx.queueName, extractRoleManagerSnapshotTx.jobId)
  console.log('👹', 'extractRoleManagerSnapshot', 'done')

  const extractLogsTx = await addJob(`extract-${client.chain.id}`, 'evmlog', {
    abiPath: 'yearn/3/roleManagerFactory', 
    chainId: client.chain.id, address: roleManagerFactory.address,
    from: inceptBlock - 1n, to: inceptBlock + 1n
  }, { priority: 1 })

  await waitForJobToFinishOrFail(extractLogsTx.queueName, extractLogsTx.jobId)
  console.log('👹', 'extractLogs', 'done')

  const extractRoleManagerFactorySnapshotTx = await addJob(`extract-${client.chain.id}`, 'snapshot', {
    abi: { abiPath: 'yearn/3/roleManagerFactory' }, 
    source: { chainId: client.chain.id, address: roleManagerFactory.address, inceptBlock: 0 }
  }, { priority: 1 })

  await waitForJobToFinishOrFail(extractRoleManagerFactorySnapshotTx.queueName, extractRoleManagerFactorySnapshotTx.jobId)
  console.log('👹', 'extractRoleManagerFactorySnapshot', 'done')

  return { projectId }
}

function randomProjectName() {
  return `Kalani Corp ${Math.floor(Math.random() * 10_000_000)}`
}

async function main() {
  const chain: Chain = {
    ...polygon,
    rpcUrls: { default: { http: [process.env.TESTNET_ADMIN_RPC_137 ?? ''] } }
  } as const

  const client = createTestnetClient(chain)
  await client.setBalance(ALICE, parseEther('1000'))

  const projectName = randomProjectName()
  console.log('👹', 'projectName', projectName)

  if (await projectExists(client, projectName, ALICE)) {
    console.log('👹', 'project already exists')
  } else {
    const { projectId } = await createProject(client, projectName, ALICE)
    console.log('👹', 'projectId', projectId)
  }
}

main()
