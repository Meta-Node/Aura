import { backendApi, encryptData } from '.'

export const transferEnergy = async transfers => {
  try {
    const brightId = localStorage.getItem('brightId')

    const encryptedData = {
      transfers,
    }

    const encryptedTransfers = encryptData(encryptedData)

    const res = await backendApi.post('/v1/energy/' + brightId, {
      encryptedTransfers,
    })
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}
