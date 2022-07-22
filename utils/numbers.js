export const toRoundedPercentage = (amount, total, decimals = 2) => {
  if (!total || !amount) return 0
  return Number(((Number(amount) / Number(total)) * 100).toFixed(decimals))
}
