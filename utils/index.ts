export const isThereProblemWithEncryption = (errorMessage?: string) => {
  if (!errorMessage) return false
  return (
    errorMessage.includes('Could not decrypt using publicKey') ||
    errorMessage.includes('TypeError [ERR_INVALID_ARG_TYPE]') ||
    errorMessage.includes('Could not decode data')
  )
}
