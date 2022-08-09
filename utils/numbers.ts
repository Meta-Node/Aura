export const toRoundedPercentage = (
  amount: number,
  total: number,
  decimals: number = 2
) => {
  if (!total || !amount) return 0
  return Number(((Number(amount) / Number(total)) * 100).toFixed(decimals))
}
