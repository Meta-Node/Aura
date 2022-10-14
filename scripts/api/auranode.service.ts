import { auraBrightIdNodeApi } from '~/scripts/api/index'

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

export const getAuraVerificationString = async (
  userId: string
): Promise<AuraVerificationString> => {
  const res = await auraBrightIdNodeApi.get<VerificationsResponse>(
    `/brightid/v6/users/${userId}/verifications`
  )
  const auraVerification = res.data?.data.verifications.find(
    verification => verification.name === 'Aura'
  )
  return auraVerification?.level || 'Not yet'
}
