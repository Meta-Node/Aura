import { AxiosInstance } from 'axios'

export type AuraVerification = 'Bronze' | 'Silver' | 'Gold'
export type AuraVerificationString = AuraVerification | 'Not yet'

export type VerificationsResponse = {
  data: {
    verifications: {
      name: string
      block: number
      timestamp: number
      level?: AuraVerification
    }[]
  }
}

export const getAuraVerificationStringFromVerificationsResponse = (
  data?: VerificationsResponse
) => {
  const auraVerification = data?.data.verifications.find(
    verification => verification.name === 'Aura'
  )
  return auraVerification?.level || 'Not yet'
}

export const getAuraVerificationString = async (
  auraBrightIdNodeApi: AxiosInstance,
  userId: string
): Promise<AuraVerificationString> => {
  const res = await auraBrightIdNodeApi.get<VerificationsResponse>(
    `/brightid/v6/users/${userId}/verifications`
  )
  return getAuraVerificationStringFromVerificationsResponse(res.data)
}

export const getVerifications = async (
  auraBrightIdNodeApi: AxiosInstance,
  userId: string
) => {
  const res = await auraBrightIdNodeApi.get<VerificationsResponse>(
    `/brightid/v6/users/${userId}/verifications`
  )
  return res.data
}
