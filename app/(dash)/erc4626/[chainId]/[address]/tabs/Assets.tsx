import { Vault, withVault } from '@/hooks/useVault'
import { fTokens } from '@/lib/format'

function Assets({ vault }: { vault: Vault }) {
  return <div>
    <div className={`
      w-1/2 h-full p-4`}>
      <table className="table-auto w-full border-separate border-spacing-2">
        <tbody>
          <tr>
            <td className="text-xl">Total assets</td>
            <td className="text-right text-xl">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}

export default withVault(Assets)
