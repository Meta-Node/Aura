import { AxiosInstance } from 'axios'
import { encryptDataWithPrivateKey } from '~/scripts/utils/crypto'
import { AuraRating, AuraRatingRetrieveResponse } from '~/types'

export const rateUser = async (
  backendApi: AxiosInstance,
  {
    fromBrightId,
    toBrightId,
    rating,
  }: {
    fromBrightId: string
    toBrightId: string
    rating: number
  }
) => {
  try {
    const encryptedData = {
      rating,
    }

    const encryptedRating = encryptDataWithPrivateKey(encryptedData)

    const endpoint = '/v1/ratings/'
    const URL = `${endpoint}${fromBrightId}/${toBrightId}`

    await backendApi.post<null>(URL, {
      encryptedRating,
    })
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export const getRatedUsers = async (
  backendApi: AxiosInstance,
  fromBrightId: string
): Promise<AuraRating[]> => {
  try {
    const res = await backendApi.get<AuraRatingRetrieveResponse>(
      '/v1/ratings/' + fromBrightId
    )
    if (!res?.data?.ratings) {
      throw new Error('Data is not defined')
    }
    return res.data.ratings
  } catch (error: any) {
    if (error?.response?.data === 'No public key defined for brightId') {
      return []
    } else {
      console.log(error)
      throw error
    }
  }
}

export const getIncomingRatings = async (
  backendApi: AxiosInstance,
  toBrightId: string
): Promise<AuraRating[]> => {
  try {
    const res = await backendApi.get<AuraRatingRetrieveResponse>(
      '/v1/ratings/inbound/' + toBrightId
    )
    if (!res?.data?.ratings) {
      throw new Error('Data is not defined')
    }
    return res.data.ratings
  } catch (error: any) {
    if (error?.response?.data === 'No public key defined for brightId') {
      return []
    } else {
      console.log(error)
      throw error
    }
  }
}
