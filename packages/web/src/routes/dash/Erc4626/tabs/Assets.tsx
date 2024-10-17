import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import DateOrBlock from '../../../../components/DateOrBlock'
import { Vault, withVault } from '../../../../hooks/useVault'
import { fTokens } from '@kalani/lib/format'

function Assets({ vault }: { vault: Vault }) {
  return <div>
    <div className="w-full p-4">
      <table className="table-auto w-full border-separate border-spacing-6">
        <tbody>
          <tr>
            <td className="text-xl">Total assets</td>
            <td className="text-right text-2xl font-bold">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
          </tr>

          <tr>
            <td>Asset</td>
            <td className="flex items-center justify-end gap-2">
              <div>{vault.asset.name}</div>
              <div>({vault.asset.symbol})</div>
              <EvmAddressChipSlide chainId={vault.chainId} address={vault.asset.address} className="bg-neutral-800" />
            </td>
          </tr>

          <tr>
            <td>Inception</td>
            <td className="text-right">
              <DateOrBlock timestamp={vault.inceptTime} block={vault.inceptBlock} className="bg-neutral-800" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
}

export default withVault(Assets)
