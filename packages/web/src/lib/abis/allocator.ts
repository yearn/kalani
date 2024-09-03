const abi = [{"inputs":[{"internalType":"address","name":"_vault","type":"address"},{"internalType":"address","name":"_governance","type":"address"},{"internalType":"uint256","name":"_minimumChange","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousGovernance","type":"address"},{"indexed":true,"internalType":"address","name":"newGovernance","type":"address"}],"name":"GovernanceTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"keeper","type":"address"},{"indexed":false,"internalType":"bool","name":"allowed","type":"bool"}],"name":"UpdateKeeper","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newMaxAcceptableBaseFee","type":"uint256"}],"name":"UpdateMaxAcceptableBaseFee","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newMaxDebtUpdateLoss","type":"uint256"}],"name":"UpdateMaxDebtUpdateLoss","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newMinimumChange","type":"uint256"}],"name":"UpdateMinimumChange","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newMinimumWait","type":"uint256"}],"name":"UpdateMinimumWait","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"strategy","type":"address"},{"indexed":false,"internalType":"uint256","name":"newTargetRatio","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newMaxRatio","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newTotalDebtRatio","type":"uint256"}],"name":"UpdateStrategyDebtRatios","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"configs","outputs":[{"internalType":"uint256","name":"targetRatio","type":"uint256"},{"internalType":"uint256","name":"maxRatio","type":"uint256"},{"internalType":"uint256","name":"lastUpdate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"debtRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"}],"name":"getStrategyMaxRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"}],"name":"getStrategyTargetRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"governance","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_vault","type":"address"},{"internalType":"address","name":"_governance","type":"address"},{"internalType":"uint256","name":"_minimumChange","type":"uint256"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"keepers","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxAcceptableBaseFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxDebtUpdateLoss","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimumChange","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"minimumWait","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_address","type":"address"},{"internalType":"bool","name":"_allowed","type":"bool"}],"name":"setKeeper","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxAcceptableBaseFee","type":"uint256"}],"name":"setMaxAcceptableBaseFee","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_maxDebtUpdateLoss","type":"uint256"}],"name":"setMaxDebtUpdateLoss","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minimumChange","type":"uint256"}],"name":"setMinimumChange","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_minimumWait","type":"uint256"}],"name":"setMinimumWait","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"},{"internalType":"uint256","name":"_targetRatio","type":"uint256"}],"name":"setStrategyDebtRatios","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"},{"internalType":"uint256","name":"_targetRatio","type":"uint256"},{"internalType":"uint256","name":"_maxRatio","type":"uint256"}],"name":"setStrategyDebtRatios","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"}],"name":"shouldUpdateDebt","outputs":[{"internalType":"bool","name":"","type":"bool"},{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_newGovernance","type":"address"}],"name":"transferGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_strategy","type":"address"},{"internalType":"uint256","name":"_targetDebt","type":"uint256"}],"name":"update_debt","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"vault","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}] as const
export default abi
