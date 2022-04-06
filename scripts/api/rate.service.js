import nacl from 'tweetnacl'
import B64 from 'base64-js'

import { backendApi } from '.'

export const rateUser = async ({ fromBrightId, toBrightId, rating }) => {
  try {
    const privateKey = localStorage.getItem('privateKey')

    if (!privateKey) {
      throw new Error('need secret key stored')
    }

    const encryptedData = {
      rating,
    }
    const utf8Encode = new TextEncoder()
    const encryptedRating = nacl.sign(
      utf8Encode.encode(JSON.stringify(encryptedData)),
      B64.toByteArray(privateKey)
    )

    const endpoint = '/v1/ratings/'
    const URL = endpoint + fromBrightId + '/' + toBrightId

    await backendApi.post(URL, {
      encryptedRating,
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}
