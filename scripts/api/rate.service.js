import { backendApi } from '.'
import { encryptDataWithPrivateKey } from '~/scripts/utils/crypto'

export const rateUser = async ({ fromBrightId, toBrightId, rating }) => {
  try {
    const encryptedData = {
      rating,
    }

    const encryptedRating = encryptDataWithPrivateKey(encryptedData)

    const endpoint = '/v1/ratings/'
    const URL = `${endpoint}${fromBrightId}/${toBrightId}`

    const res = await backendApi.post(URL, {
      encryptedRating,
    })
    if (res.status !== 200) {
      throw new Error('Could not submit rating')
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
    const res = await backendApi.get('/v1/ratings/' + brightId)
    if (!res?.data?.ratings) {
      throw new Error('Data is not defined')
    }
    return res?.data?.ratings
  } catch (error) {
    console.log(error)
    throw error
  }
}
