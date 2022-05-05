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

export const getEnergy = async transfers => {
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
