export const isThereProblemWithEncryption = (errorMessage?: string) => {
  if (typeof errorMessage !== 'string') return false
  return (
    errorMessage.includes('Could not decrypt using publicKey') ||
    errorMessage.includes('TypeError [ERR_INVALID_ARG_TYPE]') ||
    errorMessage.includes('Could not decode data')
  )
}

export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export { brightIdBaseURL } from '~/utils/constants'
