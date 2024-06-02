// 'use client'

// import { useConnectModal } from '@rainbow-me/rainbowkit'
// import { useCallback, useEffect, useMemo, useState } from 'react'
// import { useAccount, useConfig } from 'wagmi'
// import Provider, { Task, useProvider } from './provider'
// import { motion } from 'framer-motion'
// import { TfiReceipt } from 'react-icons/tfi'
// import { fTokens } from '@/lib/format'
// import { springs } from '@/lib/motion'
// import A from '@/components/elements/A'

// function GreatSuccess({ hash, message }: { hash: `0x${string}`, message: string }) {
//   const config = useConfig()
//   return <A href={`${config.getClient().chain.blockExplorers?.default.url}/tx/${hash}`} 
//     target='_blank' rel="noreferrer">
//     <div className="flex items-center gap-2">
//       <TfiReceipt />
//       <div>{message}</div>
//     </div>
//   </A>
// }

// function Provided({ className }: { className?: string }) {
//   const { openConnectModal } = useConnectModal()
//   const account = useAccount()
//   const [mounted, setMounted] = useState(false)
//   useEffect(() => setMounted(true), [])

//   const {
//     task, token, amount, setAmount, 
//     needsApproval, approve, execute, amountExecuted, 
//     isApproved, isError, error, reset 
//   } = useProvider()

//   const hasBalance = useMemo(() => task.token.balance > 0n, [task])

//   const disabled = useMemo(() => 
//     mounted
//     && account.isConnected 
//     && (!hasBalance || amount === 0n)
//   , [mounted, account, hasBalance, amount])

//   const verbPastTense = useMemo(() => {
//     if (task.verb === "unstake") {
//       return "unstaked"
//     }
//     if (task.verb === "mint") {
//       return "minted"
//     }
//     const doc = nlp(task.verb)
//     doc.verbs().toPastTense()
//     return doc.text()
//   }, [task])  

//   const label = useMemo(() => {
//     if (!mounted) return {
//       key: 'loading',
//       text: 'Connect'
//     }
//     if (!account.isConnected) return {
//       key: 'connect',
//       text: 'Connect'
//     }
//     if (needsApproval && !approve.receipt.isLoading) return {
//       key: 'approve',
//       text: 'Approve'
//     }
//     if (approve.receipt.isLoading) return {
//       key: 'approve-confirm',
//       text: 'Confirming'
//     }
//     if (execute.receipt.isLoading) return {
//       key: 'execute-confirm',
//       text: 'Confirming'
//     }
//     return {
//       key: 'verb',
//       text: task.verb
//     }
//   }, [mounted, account, needsApproval, approve, execute, task])

//   const subtext = useMemo(() => {
//     if (isError) { return {
//       key: 'error',
//       text: <div>🛑 Error! Please contact support</div>
//     }}
//     if (approve.receipt.isLoading) { return {
//       key: 'approve-confirm',
//       text: <div>Confirming approval...</div>
//     }}
//     if (execute.receipt.isLoading) { return {
//       key: 'execute-confirm',
//       text: <div>{`Confirming ${task.verb}...`}</div>
//     }}
//     if ((!needsApproval || isApproved) && execute.receipt.isSuccess) { return {
//       key: 'success',
//       text: <GreatSuccess hash={execute.hash!} message={`You ${verbPastTense} ${fTokens(amountExecuted, token.decimals)} ${token.symbol}!`} />
//     }}
//     return {
//       key: 'default',
//       text: <div>{`You have ${fTokens(token.balance, token.decimals)} ${token.symbol}`}</div>
//     }
//   }, [needsApproval, isApproved, isError, approve, execute, task, verbPastTense, amountExecuted, token])

//   const theme = useMemo(() => {
//     if (!account.isConnected) return 'transparent'
//     if (approve.receipt.isLoading) return 'onit'
//     if (execute.receipt.isLoading) return 'onit'
//     return 'default'
//   }, [account, approve, execute])

//   useEffect(() => {
//     if (isError) console.error(error)
//   }, [isError, error])

//   const onClick = useCallback(() => {
//     if (approve.receipt.isLoading || execute.receipt.isLoading) {
//       return
//     } else if (!account.isConnected) {
//       openConnectModal?.()
//     } else if (needsApproval) {
//       approve.write()
//     } else {
//       execute.write()
//     }
//   }, [account, approve, execute, openConnectModal, needsApproval])

//   useEffect(() => {
//     if (token.balance && noInput) {
//       setAmount(token.balance)
//     }
//   }, [token, noInput, setAmount])

//   return <div className={`flex flex-col gap-2 ${className}`}>
//     <div className={`flex gap-2 ${noInput ? 'justify-center' : ''}`}>
//       {!noInput && <InputTokenAmount
//         amount={amount}
//         decimals={token.decimals}
//         max={token.balance}
//         onChange={value => setAmount(value)}
//         onMaxClick={() => setAmount(token.balance)} />}
//       <Button
//         onClick={onClick}
//         theme={theme}
//         disabled={disabled}
//         className={`shrink-0 capitalize overflow-hidden ${noInput ? 'text-black bg-yellow-400 hover:bg-yellow-400 hover:opacity-70' : ''}`}
//         style={{ width: '135px', paddingLeft: 0, paddingRight: 0 }}
//         noInput={noInput} >
//         {label.text}
//       </Button>
//     </div>
//     {!noInput && <div className={`pl-3 font-thin text-xs ${isError ? 'text-charge-yellow' : 'opacity-70'}`}>
//       <motion.div key={subtext.key}
//         transition={springs.roll}
//         initial={mounted ? { x: 40, opacity: 0 } : false}
//         animate={{ x: 0, opacity: 1 }}
//         exit={{ x: -40, opacity: 0 }} >
//         {subtext.text}
//       </motion.div>
//     </div>}
//   </div>
// }

// export default function InputExecute({ task, className }: { task: Task, className?: string }) {
//   return <Provider task={task}><Provided className={className} /></Provider>
// }
