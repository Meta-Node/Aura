import { backendApi } from '.'
import { encryptDataWithPrivateKey } from '~/scripts/utils/crypto'

export const transferEnergy = async transfers => {
  try {
    const brightId = localStorage.getItem('brightId')

    const encryptedData = {
      transfers,
    }
    const encryptedTransfers = encryptDataWithPrivateKey(encryptedData)
    const res = await backendApi.post('/v1/energy/' + brightId, {
      encryptedTransfers,
    })
    if (res.status !== 200) {
      throw res.originalError
    }
    return res
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getEnergy = async () => {
  try {
    const brightId = localStorage.getItem('brightId')

    const res = await backendApi.get('/v1/energy/' + brightId)
    if (!res.data) {
      throw new Error('Energy data in not defined')
    }
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getInboundEnergy = async () => {
  try {
    const brightId = localStorage.getItem('brightId')

    const res = await backendApi.get('/v1/energy/inbound/' + brightId)
    if (!res.data) {
      throw new Error('Energy data in not defined')
    }
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}
