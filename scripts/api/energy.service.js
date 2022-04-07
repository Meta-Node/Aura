import { backendApi, encryptData } from '.'

export const transferEnergy = async transfers => {
  try {
    const brightId = localStorage.getItem('brightId')
    const publicKey = localStorage.getItem('publicKey')

    const encryptedData = {
      transfers,
    }

    const encryptedTransfers = encryptData(encryptedData)

    const res = await backendApi.post('/v1/energy/' + brightId, {
      publicKey,
      encryptedTransfers,
    })
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}
