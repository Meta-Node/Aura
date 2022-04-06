import { backendApi, encryptData } from '.'

export const rateUser = async ({ fromBrightId, toBrightId, rating }) => {
  try {
    const encryptedData = {
      rating,
    }

    const encryptedRating = encryptData(encryptedData)

    const endpoint = '/v1/ratings/'
    const URL = `${endpoint}${fromBrightId}/${toBrightId}`

    await backendApi.post(URL, {
      encryptedRating,
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}
