import { backendApi } from '.'
import { encryptDataWithPrivateKey } from '~/scripts/utils/crypto'
import { AuraRatingRetrieveResponse } from '~/types'

export const rateUser = async ({
  fromBrightId,
  toBrightId,
  rating,
}: {
  fromBrightId: string
  toBrightId: string
  rating: number
}) => {
  try {
    const encryptedData = {
      rating,
    }

    const encryptedRating = encryptDataWithPrivateKey(encryptedData)

    const endpoint = '/v1/ratings/'
    const URL = `${endpoint}${fromBrightId}/${toBrightId}`

    const res = await backendApi.post<null>(URL, {
      encryptedRating,
    })
    console.log(res)
    if (res.status !== 200) {
      throw res.originalError
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getRatedUsers = async () => {
  const brightId = localStorage.getItem('brightId')
  if (!brightId) {
    throw new Error('BrightId is not defined')
  }
  try {
    const res = await backendApi.get<AuraRatingRetrieveResponse>(
      '/v1/ratings/' + brightId
    )
    if (!res?.data?.ratings) {
      throw new Error('Data is not defined')
    }
    return res?.data?.ratings
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getIncomingRatings = async (toBrightId: string) => {
  try {
    const res = await backendApi.get<AuraRatingRetrieveResponse>(
      '/v1/ratings/inbound/' + toBrightId
    )
    if (!res?.data?.ratings) {
      throw new Error('Data is not defined')
    }
    return res?.data?.ratings
  } catch (error) {
    console.log(error)
    throw error
  }
}
