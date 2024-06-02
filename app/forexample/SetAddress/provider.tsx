import { z } from 'zod'
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { UseSimulateContractParameters, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { erc20Abi, maxUint256, zeroAddress } from 'viem'

export const TaskSchema = z.object({
  verb: z.string().default(''),
  token: TokenSchema.default({}),
  needsApproval: z.boolean().default(false),
  parameters: z.object({
    address: zhexstringSchema.default(zeroAddress),
    abi: z.any().default([]),
    functionName: z.string().default(''),
    args: z.function().args(z.bigint()).returns(z.any().array())
  }).default({
    address: zeroAddress,
    abi: [],
    functionName: '',
    args: () => []
  })
})

export type Task = z.infer<typeof TaskSchema>

const setAmountSchema = z.function()
.args(z.bigint().or(z.function().args(z.bigint()).returns(z.bigint())))
.returns(z.void())

const contractSimulationStatuses = [
  'error', 'pending', 'success'
] as const
export const ContractSimulationStatusSchema = z.enum(contractSimulationStatuses)

const contractStatuses = [
  'error', 'pending', 'success', 'idle'
] as const
export const ContractStatusSchema = z.enum(contractStatuses)

const contractReceiptStatuses = [
  'error', 'pending', 'success'
] as const
export const ContractReceiptStatusSchema = z.enum(contractReceiptStatuses)

const ContractClientSchema = z.object({
  status: ContractStatusSchema.default('idle'),
  write: z.function().default(() => {}),
  hash: zhexstringSchema.optional(),
  disabled: z.boolean().default(true),
  isIdle: z.boolean().default(true),
  isPending: z.boolean().default(false),
  isSuccess: z.boolean().default(false),
  isError: z.boolean().default(false),
  error: z.string().nullish(),
  simulation: z.object({
    status: ContractSimulationStatusSchema.default('pending'),
    disabled: z.boolean().default(true),
    isPending: z.boolean().default(false),
    isSuccess: z.boolean().default(false),
    isError: z.boolean().default(false),
    error: z.string().nullish(),
  }).default({}),
  receipt: z.object({
    status: ContractReceiptStatusSchema.default('pending'),
    isPending: z.boolean().default(false),
    isLoading: z.boolean().default(false),
    isSuccess: z.boolean().default(false),
    isError: z.boolean().default(false),
    error: z.string().nullish(),
  }).default({})
})

const ContextSchema = z.object({
  task: TaskSchema.default({}),
  needsApproval: z.boolean().default(false),
  isApproved: z.boolean().default(false),
  isExecuted: z.boolean().default(false),
  isError: z.boolean().default(false),
  error: z.string().nullish(),
  token: TokenSchema.default(TokenSchema.parse({})),
  amount: z.bigint().default(0n),
  setAmount: setAmountSchema.default(() => {}),
  approve: ContractClientSchema.default({}),
  execute: ContractClientSchema.default({}),
  amountApproved: z.bigint().default(0n),
  amountExecuted: z.bigint().default(0n),
  verb: z.string().default(''),
  reset: z.function().default(() => {})
})

type Context = z.infer<typeof ContextSchema>

export const context = createContext<Context>(ContextSchema.parse({ 
  setAmount: () => {},
  approve: { write: () => {} },
  execute: { write: () => {} },
  reset: () => {}
}))

export const useProvider = () => useContext(context)

export default function Provider({ task, children }: { task: Task, children: ReactNode }) {
  const { refetch } = useData()
  const [amount, setAmount] = useState(0n)
  const [amountApproved, setAmountApproved] = useState(0n)
  const [amountExecuted, setAmountExecuted] = useState(0n)
  const [isApproved, setIsApproved] = useState(false)
  const [isExecuted, setIsExecuted] = useState(false)
  const { token } = task

  const [allowance, setAllowance] = useState(0n)

  useEffect(() => {
    const _allowance = token.allowances.find(a => a.address === task.parameters.address)
    setAllowance(_allowance?.amount || 0n)
  }, [token, task, setAllowance])

  const needsApproval = useMemo(() => {
    return task.needsApproval && allowance < (amount - amountApproved)
  }, [task, allowance, amount, amountApproved])

  const executeContractParameters = useMemo<UseSimulateContractParameters>(() => 
    ({
      ...task.parameters, 
      args: task.parameters.args(amount),
      query: { enabled: amount > 0n && (!needsApproval || allowance >= amount) }
    }), 
  [amount, task, needsApproval, allowance])

  const simulateExecute = useSimulateContract(executeContractParameters)

  const _execute = useWriteContract()
  const _executeReceipt = useWaitForTransactionReceipt({ hash: _execute.data })
  const execute = useMemo(() => ({
    write: () => {
      setIsExecuted(false)
      _execute.writeContract(simulateExecute.data!.request)
      setAmountExecuted(amount)
    },
    hash: _execute.data,
    disabled: !Boolean(simulateExecute.data?.request),
    status: _execute.status,
    isIdle: _execute.isIdle,
    isPending: _execute.isPending,
    isSuccess: _execute.isSuccess,
    isError: _execute.isError,
    error: _execute.error?.toString(),
    simulation: {
      status: simulateExecute.status,
      disabled: !(amount > 0n && allowance >= amount),
      isPending: simulateExecute.isPending,
      isSuccess: simulateExecute.isSuccess,
      isError: simulateExecute.isError,
      error: simulateExecute.error?.toString()
    },
    receipt: {
      status: _executeReceipt.status,
      isPending: _executeReceipt.isPending,
      isLoading: _executeReceipt.isLoading,
      isSuccess: _executeReceipt.isSuccess,
      isError: _executeReceipt.isError,
      error: _executeReceipt.error?.toString()
    }
  }), [setIsExecuted, _execute, _executeReceipt, simulateExecute, amount, setAmountExecuted, allowance])

  useEffect(() => {
    if (_executeReceipt.isSuccess && !isExecuted) {
      setIsExecuted(true)
      setAmount(0n)
      setAmountApproved(0n)
      refetch()
    }
  }, [_executeReceipt, isExecuted, setIsExecuted, setAmount, setAmountApproved, refetch])

  const simulateApprove = useSimulateContract({
    address: token.address,
    abi: erc20Abi,
    functionName: 'approve',
    args: [task.parameters.address!, maxUint256],
    query: { enabled: needsApproval && amount > 0n }
  })

  const _approve = useWriteContract()
  const _approveReceipt = useWaitForTransactionReceipt({ hash: _approve.data })
  const approve = useMemo(() => ({
    write: () => {
      setIsApproved(false)
      _approve.writeContract(simulateApprove.data!.request)
    },
    hash: _approve.data,
    disabled: !Boolean(simulateApprove.data?.request),
    status: _approve.status,
    isIdle: _approve.isIdle,
    isPending: _approve.isPending,
    isSuccess: _approve.isSuccess,
    isError: _approve.isError,
    error: _approve.error?.toString(),
    simulation: {
      status: simulateApprove.status,
      disabled: amount < 1n,
      isPending: simulateApprove.isPending,
      isSuccess: simulateApprove.isSuccess,
      isError: simulateApprove.isError,
      error: simulateApprove.error?.toString()
    },
    receipt: {
      status: _approveReceipt.status,
      isPending: _approveReceipt.isPending,
      isLoading: _approveReceipt.isLoading,
      isSuccess: _approveReceipt.isSuccess,
      isError: _approveReceipt.isError,
      error: _approveReceipt.error?.toString()
    }
  }), [setIsApproved, _approve, _approveReceipt, simulateApprove, amount])

  useEffect(() => {
    if (_approveReceipt.isSuccess && !isApproved) {
      setAmountApproved(amount)
      setAllowance(amount)
      setIsApproved(true)
      _execute.reset()
      refetch()
    }
  }, [_execute, _approveReceipt, isApproved, amount, setAmountApproved, setAllowance, setIsApproved, refetch])

  const error = useMemo(() => 
    approve.simulation.error
    || approve.error 
    || approve.receipt.error
    || execute.simulation.error
    || execute.error
    || execute.receipt.error, 
  [approve, execute])

  const isError = useMemo(() => {
    if (error?.toString().includes('User denied transaction')) return false
    return approve.simulation.isError 
    || approve.isError
    || approve.receipt.isError
    || execute.simulation.isError 
    || execute.isError
    || execute.receipt.isError
  }, [approve, execute, error])

  const reset = useCallback(() => {
    setAmount(0n)
    setAmountApproved(0n)
    setAmountExecuted(0n)
    _approve.reset()
    _execute.reset()
    refetch()
  }, [setAmount, setAmountApproved, setAmountExecuted, _approve, _execute, refetch])

  return <context.Provider value={{ 
    task,
    needsApproval,
    isApproved,
    isExecuted,
    isError,
    error,
    token,
    amount,
    setAmount,
    approve,
    execute,
    amountApproved,
    amountExecuted,
    verb: task.verb,
    reset
    }}>
    {children}
  </context.Provider>
}
