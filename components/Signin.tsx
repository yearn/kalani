'use client'

import { useWeb3 } from '@yearn-finance/web-lib/contexts/useWeb3'
import { useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { IconWallet } from '@yearn-finance/web-lib/icons/IconWallet'
import { truncateHex } from '@yearn-finance/web-lib/utils/address'
import { AnimatePresence, motion } from 'framer-motion'
import { useSiwe } from '@/hooks/useSiwe'
import { IconLoader } from '@yearn-finance/web-lib/icons/IconLoader'
import { toast } from '@yearn-finance/web-lib/components/yToast'

export default function Signin({ hideSignOut }: { hideSignOut?: boolean }) {
	const { connectModalOpen } = useConnectModal()
	const { openAccountModal, accountModalOpen } = useAccountModal()
	const { openChainModal, chainModalOpen } = useChainModal()
	const { isActive, address, chainID: chainId, ens, lensProtocolHandle, openLoginModal } = useWeb3()
	const [walletIdentity, set_walletIdentity] = useState<string | undefined>(undefined)
	const { signMessageAsync } = useSignMessage()
	const [accountModelOpened, set_accountModelOpened] = useState<boolean>(false)
  const { nonce, verifying, signedIn, fetchNonce, fetchWhoami, setSigningIn, setVerifying } = useSiwe()
' '
	useEffect(() => {
    setSigningIn(connectModalOpen || accountModalOpen || chainModalOpen)
	}, [setSigningIn, connectModalOpen, accountModalOpen, chainModalOpen])

	const signIn = useCallback(async () => {
		if(!(address && chainId)) return
    setSigningIn(true)

		const message = new SiweMessage({
			domain: window.location.host,
			address,
			statement: 'This message confirms that you want to sign in to yAuto.',
			uri: window.location.origin,
			version: '1',
			chainId,
			nonce
		})

		const signature = await signMessageAsync({
			message: message.prepareMessage()
		})

    setVerifying(true)
		const verify = await fetch('/api/siwe/verify', {
			method: 'POST', 
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, signature })
		})
    setVerifying(false)

    if(!verify.ok) {
			toast({ type: 'error', content: `There was an error signing you in. Please try again!` })
			throw new Error('Bad message!!')
		}

    fetchWhoami()
    setSigningIn(false)
  }, [setSigningIn, address, chainId, nonce, signMessageAsync, fetchWhoami, setVerifying])

	const signOut = useCallback(async () => {
		await fetch('/api/siwe/signout', {
			method: 'POST', 
			headers: { 'Content-Type': 'application/json' }
		})

    fetchNonce()
    fetchWhoami()
    setSigningIn(false)
  }, [fetchNonce, fetchWhoami, setSigningIn])

	useEffect((): void => {
		if (!isActive && address) {
			set_walletIdentity('Invalid Network')
		} else if (ens) {
			set_walletIdentity(ens)
		} else if (lensProtocolHandle) {
			set_walletIdentity(lensProtocolHandle)
		} else if (address) {
			set_walletIdentity(truncateHex(address, 4))
		} else {
			set_walletIdentity(undefined)
			if(accountModelOpened) signOut()
		}
	}, [ens, lensProtocolHandle, address, isActive, accountModelOpened, signOut])

	const label = useMemo(() => {
		if(!walletIdentity) return 'Connect wallet'
		if(!signedIn) return `Sign in to yAuto as ${walletIdentity}`
		return `signed in as ${walletIdentity}`
	}, [walletIdentity, signedIn])

	return (
		<div className={`relative ${signedIn && hideSignOut ? 'hidden' : ''}`}
			onClick={() => {
				if (isActive) {
					if(signedIn) {
						openAccountModal?.()
						set_accountModelOpened(true)
					} else {
						signIn()
					}
				} else if (!isActive && address) {
					openChainModal?.()
				} else {
					openLoginModal()
				}
			}}>
      <AnimatePresence initial={false}>
        {isActive && !signedIn && !verifying && <motion.div 
          transition={{type: 'spring', stiffness: 2000, damping: 32}}
          initial={{y: 6, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: 6, opacity: 0}}
          className={'absolute top-2 -left-12 text-xs text-neutral-0/20 whitespace-nowrap'}>
          step 2
        </motion.div>}
        {isActive && !signedIn && verifying && <motion.div 
          transition={{type: 'spring', stiffness: 2000, damping: 32}}
          initial={{y: 6, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: 6, opacity: 0}}
          className={'absolute top-0 -left-8 text-xs text-neutral-0/20 whitespace-nowrap'}>
          <IconLoader className={'h-6 w-6 animate-spin text-neutral-0'} />
        </motion.div>}
      </AnimatePresence>
			<p suppressHydrationWarning className={'yearn--header-nav-item !text-xs md:!text-sm'}>
				{signedIn ? label : <span>
					<IconWallet className="yearn--header-nav-item mt-0.5 block h-4 w-4 md:hidden" />
					<span className={`
						relative hidden md:flex h-8 px-3 py-4 cursor-pointer items-center justify-center
						border border-transparent bg-orange-950 
						px-2 text-xs font-normal text-neutral-0 transition-all rounded
						hover:text-violet-300 hover:bg-neutral-900 hover:border-violet-300
						active:text-violet-400 active:border-violet-400`}>
						{label}
					</span>
				</span>}
			</p>
		</div>
	)
}
