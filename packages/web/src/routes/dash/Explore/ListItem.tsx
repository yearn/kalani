import { FinderItem, getItemHref } from '../../../components/Finder/useFinderItems'
import { fEvmAddress, fHexString, fPercent, fUSD } from '@kalani/lib/format'
import { AutoTextSize } from 'auto-text-size'
import ChainImg from '../../../components/ChainImg'
import TokenImg from '../../../components/TokenImg'
import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ROLES } from '@kalani/lib/types'
import { roleClassNames } from '../Vault/tabs/Roles/SetRoles/roleClassNames'
import { PiStar, PiStarFill } from 'react-icons/pi'

function Role({ role, granted }: { role: keyof typeof ROLES, granted: boolean }) {
  const roleClassName = roleClassNames[role as keyof typeof roleClassNames] ?? {}
  const checkedClassName = `${roleClassName.checked} group-active:text-inherit`
  return <div className={`
    text-xs ${roleClassName.defaults} ${granted ? checkedClassName : roleClassName.unchecked}
    whitespace-nowrap pointer-events-none`}>
    {role.replace('_MANAGER', '').replace('_', ' ')}
  </div>
}

function RoleMask({ roleMask, isRoleManager }: { roleMask: bigint, isRoleManager: boolean }) {
  const granted = useCallback((role: keyof typeof ROLES) => (roleMask & ROLES[role]) === ROLES[role], [roleMask])
  const isRoleManagerClassName = useMemo(() => isRoleManager ? 'text-yellow-400' : 'text-neutral-600', [isRoleManager])
  return <div className="flex items-center flex-wrap gap-2 text-xs">
    <div className={"text-neutral-600"}>ROLES:</div>
    <div className={isRoleManagerClassName}>
      {isRoleManager ? <PiStarFill size={12} /> : <PiStar size={12} />}
    </div>
    <div className={isRoleManagerClassName}>ROLE MANAGER</div>
    {Object.keys(ROLES).map(role => <div key={role} className="flex items-center gap-2">
      <div className="text-xs text-neutral-600">//</div>
      <Role role={role as keyof typeof ROLES} granted={granted(role as keyof typeof ROLES)} />
    </div>
    )}
  </div>
}

export function Minibars({ series, className }: { series: number[], className?: string }) {
	const maxBar = 100
	const maxSeries = Math.max(...series)
	const scale = maxBar / maxSeries
	const bars = series.map(value => Math.round(scale * value) || 1)
	return <div className={`flex items-end gap-2 ${className}`}>
		{bars.map((bar, index) => <div key={index} className={`
			w-full h-[${bar}%] bg-neutral-400 group-active:bg-secondary-400
      ${index === 0 ? 'rounded-bl-sm' : ''}
      ${index === bars.length - 1 ? 'rounded-br-sm' : ''}
    `} />)}
	</div>
}

function Label({ item }: { item: FinderItem }) {
  const label = useMemo(() => {
    if (item.projectId) return item.projectName ?? `project ${fHexString(item.projectId, true)}`
    return item.label
  }, [item])

  const bgClassName = useMemo(() => {
    switch (item.label) {
      case 'yVault': return 'bg-secondary-900'
      case 'yStrategy': return 'bg-secondary-900'
      default: return 'bg-neutral-900'
    }
  }, [item])

  const textClassName = useMemo(() => {
    switch (item.label) {
      case 'yVault': return 'text-neutral-100'
      case 'yStrategy': return 'text-neutral-100'
      default: return 'text-neutral-400'
    }
  }, [item])

  return <div className={`p-2 text-xs rounded-full ${bgClassName} ${textClassName} group-active:text-inherit`}>
    {label}
  </div>
}

export function ListItem({ item, roleMask, isRoleManager }: { item: FinderItem, roleMask?: bigint, isRoleManager?: boolean }) {
  return <Link to={getItemHref(item)} className={`
    group relative p-3 sm:px-6 xl:px-8 xl:py-5 flex flex-col gap-3
    border-primary border-transparent hover:border-secondary-200 active:border-secondary-400
    saber-glow bg-black rounded-primary cursor-pointer
    active:text-secondary-400`}>
    <div className="flex items-center gap-6 xl:gap-12">
      <div className="grow w-[300px] flex flex-col gap-2">
        <div className="font-fancy text-2xl">
          <AutoTextSize mode="box" minFontSizePx={16}>{item.name}</AutoTextSize>
        </div>
        <div className="flex items-center gap-4">
          <ChainImg chainId={item.chainId} size={28} />
          <TokenImg chainId={item.chainId} address={item.token?.address} size={28}  />
          <Label item={item} />
          <div className="p-2 bg-neutral-900 text-xs text-neutral-400 group-active:text-inherit rounded-full">{fEvmAddress(item.address)}</div>
        </div>
      </div>
      <div className="w-[100px] flex items-center justify-center">
        <Minibars series={item.sparklines?.tvl ?? []} className="w-[80px] h-[56px]" />
      </div>
      <div className="w-[140px]">
        <div className="text-2xl font-bold">
          {fUSD(item.tvl ?? 0)}
        </div>
      </div>
      <div className="w-[100px]">
        <div className="text-2xl font-bold">
          {fPercent(item.apy ?? 0)}
        </div>
      </div>
    </div>
    {roleMask !== undefined && <RoleMask roleMask={roleMask} isRoleManager={isRoleManager ?? false} />}
  </Link>
}
