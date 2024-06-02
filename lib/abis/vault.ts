const abi = [{"name":"Deposit","inputs":[{"name":"sender","type":"address","indexed":true},{"name":"owner","type":"address","indexed":true},{"name":"assets","type":"uint256","indexed":false},{"name":"shares","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Withdraw","inputs":[{"name":"sender","type":"address","indexed":true},{"name":"receiver","type":"address","indexed":true},{"name":"owner","type":"address","indexed":true},{"name":"assets","type":"uint256","indexed":false},{"name":"shares","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Transfer","inputs":[{"name":"sender","type":"address","indexed":true},{"name":"receiver","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true},{"name":"spender","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"StrategyChanged","inputs":[{"name":"strategy","type":"address","indexed":true},{"name":"change_type","type":"uint256","indexed":true}],"anonymous":false,"type":"event"},{"name":"StrategyReported","inputs":[{"name":"strategy","type":"address","indexed":true},{"name":"gain","type":"uint256","indexed":false},{"name":"loss","type":"uint256","indexed":false},{"name":"current_debt","type":"uint256","indexed":false},{"name":"protocol_fees","type":"uint256","indexed":false},{"name":"total_fees","type":"uint256","indexed":false},{"name":"total_refunds","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"DebtUpdated","inputs":[{"name":"strategy","type":"address","indexed":true},{"name":"current_debt","type":"uint256","indexed":false},{"name":"new_debt","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"RoleSet","inputs":[{"name":"account","type":"address","indexed":true},{"name":"role","type":"uint256","indexed":true}],"anonymous":false,"type":"event"},{"name":"RoleStatusChanged","inputs":[{"name":"role","type":"uint256","indexed":true},{"name":"status","type":"uint256","indexed":true}],"anonymous":false,"type":"event"},{"name":"UpdateRoleManager","inputs":[{"name":"role_manager","type":"address","indexed":true}],"anonymous":false,"type":"event"},{"name":"UpdateAccountant","inputs":[{"name":"accountant","type":"address","indexed":true}],"anonymous":false,"type":"event"},{"name":"UpdateDepositLimitModule","inputs":[{"name":"deposit_limit_module","type":"address","indexed":true}],"anonymous":false,"type":"event"},{"name":"UpdateWithdrawLimitModule","inputs":[{"name":"withdraw_limit_module","type":"address","indexed":true}],"anonymous":false,"type":"event"},{"name":"UpdateDefaultQueue","inputs":[{"name":"new_default_queue","type":"address[]","indexed":false}],"anonymous":false,"type":"event"},{"name":"UpdateUseDefaultQueue","inputs":[{"name":"use_default_queue","type":"bool","indexed":false}],"anonymous":false,"type":"event"},{"name":"UpdatedMaxDebtForStrategy","inputs":[{"name":"sender","type":"address","indexed":true},{"name":"strategy","type":"address","indexed":true},{"name":"new_debt","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"UpdateDepositLimit","inputs":[{"name":"deposit_limit","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"UpdateMinimumTotalIdle","inputs":[{"name":"minimum_total_idle","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"UpdateProfitMaxUnlockTime","inputs":[{"name":"profit_max_unlock_time","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"DebtPurchased","inputs":[{"name":"strategy","type":"address","indexed":true},{"name":"amount","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Shutdown","inputs":[],"anonymous":false,"type":"event"},{"stateMutability":"nonpayable","type":"constructor","inputs":[{"name":"asset","type":"address"},{"name":"name","type":"string"},{"name":"symbol","type":"string"},{"name":"role_manager","type":"address"},{"name":"profit_max_unlock_time","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_accountant","inputs":[{"name":"new_accountant","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_default_queue","inputs":[{"name":"new_default_queue","type":"address[]"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_use_default_queue","inputs":[{"name":"use_default_queue","type":"bool"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_deposit_limit","inputs":[{"name":"deposit_limit","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_deposit_limit_module","inputs":[{"name":"deposit_limit_module","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_withdraw_limit_module","inputs":[{"name":"withdraw_limit_module","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_minimum_total_idle","inputs":[{"name":"minimum_total_idle","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"setProfitMaxUnlockTime","inputs":[{"name":"new_profit_max_unlock_time","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_role","inputs":[{"name":"account","type":"address"},{"name":"role","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"add_role","inputs":[{"name":"account","type":"address"},{"name":"role","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"remove_role","inputs":[{"name":"account","type":"address"},{"name":"role","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"set_open_role","inputs":[{"name":"role","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"close_open_role","inputs":[{"name":"role","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"transfer_role_manager","inputs":[{"name":"role_manager","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"accept_role_manager","inputs":[],"outputs":[]},{"stateMutability":"view","type":"function","name":"isShutdown","inputs":[],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"unlockedShares","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"pricePerShare","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"get_default_queue","inputs":[],"outputs":[{"name":"","type":"address[]"}]},{"stateMutability":"nonpayable","type":"function","name":"process_report","inputs":[{"name":"strategy","type":"address"}],"outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"buy_debt","inputs":[{"name":"strategy","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"add_strategy","inputs":[{"name":"new_strategy","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"revoke_strategy","inputs":[{"name":"strategy","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"force_revoke_strategy","inputs":[{"name":"strategy","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"update_max_debt_for_strategy","inputs":[{"name":"strategy","type":"address"},{"name":"new_max_debt","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"update_debt","inputs":[{"name":"strategy","type":"address"},{"name":"target_debt","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"shutdown_vault","inputs":[],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"deposit","inputs":[{"name":"assets","type":"uint256"},{"name":"receiver","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"mint","inputs":[{"name":"shares","type":"uint256"},{"name":"receiver","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[{"name":"assets","type":"uint256"},{"name":"receiver","type":"address"},{"name":"owner","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[{"name":"assets","type":"uint256"},{"name":"receiver","type":"address"},{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[{"name":"assets","type":"uint256"},{"name":"receiver","type":"address"},{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"},{"name":"strategies","type":"address[]"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"redeem","inputs":[{"name":"shares","type":"uint256"},{"name":"receiver","type":"address"},{"name":"owner","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"redeem","inputs":[{"name":"shares","type":"uint256"},{"name":"receiver","type":"address"},{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"redeem","inputs":[{"name":"shares","type":"uint256"},{"name":"receiver","type":"address"},{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"},{"name":"strategies","type":"address[]"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"nonpayable","type":"function","name":"approve","inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"transfer","inputs":[{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"transferFrom","inputs":[{"name":"sender","type":"address"},{"name":"receiver","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"increaseAllowance","inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"decreaseAllowance","inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"nonpayable","type":"function","name":"permit","inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"},{"name":"amount","type":"uint256"},{"name":"deadline","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"balanceOf","inputs":[{"name":"addr","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"asset","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint8"}]},{"stateMutability":"view","type":"function","name":"totalAssets","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"totalIdle","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"totalDebt","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"convertToShares","inputs":[{"name":"assets","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"previewDeposit","inputs":[{"name":"assets","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"previewMint","inputs":[{"name":"shares","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"convertToAssets","inputs":[{"name":"shares","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxDeposit","inputs":[{"name":"receiver","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxMint","inputs":[{"name":"receiver","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxWithdraw","inputs":[{"name":"owner","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxWithdraw","inputs":[{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxWithdraw","inputs":[{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"},{"name":"strategies","type":"address[]"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxRedeem","inputs":[{"name":"owner","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxRedeem","inputs":[{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"maxRedeem","inputs":[{"name":"owner","type":"address"},{"name":"max_loss","type":"uint256"},{"name":"strategies","type":"address[]"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"previewWithdraw","inputs":[{"name":"assets","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"previewRedeem","inputs":[{"name":"shares","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"apiVersion","inputs":[],"outputs":[{"name":"","type":"string"}]},{"stateMutability":"view","type":"function","name":"assess_share_of_unrealised_losses","inputs":[{"name":"strategy","type":"address"},{"name":"assets_needed","type":"uint256"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"profitMaxUnlockTime","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"fullProfitUnlockDate","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"profitUnlockingRate","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"lastProfitUpdate","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"DOMAIN_SEPARATOR","inputs":[],"outputs":[{"name":"","type":"bytes32"}]},{"stateMutability":"view","type":"function","name":"FACTORY","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"strategies","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"tuple","components":[{"name":"activation","type":"uint256"},{"name":"last_report","type":"uint256"},{"name":"current_debt","type":"uint256"},{"name":"max_debt","type":"uint256"}]}]},{"stateMutability":"view","type":"function","name":"default_queue","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"use_default_queue","inputs":[],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"allowance","inputs":[{"name":"arg0","type":"address"},{"name":"arg1","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"total_supply","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"minimum_total_idle","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"deposit_limit","inputs":[],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"accountant","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"deposit_limit_module","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"withdraw_limit_module","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"roles","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}]},{"stateMutability":"view","type":"function","name":"open_roles","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"bool"}]},{"stateMutability":"view","type":"function","name":"role_manager","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"future_role_manager","inputs":[],"outputs":[{"name":"","type":"address"}]},{"stateMutability":"view","type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string"}]},{"stateMutability":"view","type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string"}]},{"stateMutability":"view","type":"function","name":"nonces","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}]}] as const
export default abi
