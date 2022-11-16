import { AxiosInstance } from 'axios'
import { encryptDataWithPrivateKey } from '~/scripts/utils/crypto'
import {
  EnergyAllocationList,
  EnergyAllocationRetrieveResponse,
  EnergyAllocationUpdateResponse,
  InboundEnergyAllocationList,
  InboundEnergyAllocationRetrieveResponse,
} from '~/types'

export const transferEnergy = async (
  backendApi: AxiosInstance,
  transfers: EnergyAllocationList
) => {
  try {
    const brightId = localStorage.getItem('brightId')

    const encryptedData = {
      transfers,
    }
    const encryptedTransfers = encryptDataWithPrivateKey(encryptedData)
    return await backendApi.post<EnergyAllocationUpdateResponse>(
      '/v1/energy/' + brightId,
      {
        encryptedTransfers,
      }
    )
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getEnergy = async (
  backendApi: AxiosInstance,
  fromBrightId: string
): Promise<EnergyAllocationList> => {
  try {
    const res = await backendApi.get<EnergyAllocationRetrieveResponse>(
      '/v1/energy/' + fromBrightId
    )
    if (!res?.data?.energy) {
      throw new Error('Energy data in not defined')
    }
    return res.data.energy
  } catch (error: any) {
    if (error?.response?.data === 'No public key defined for brightId') {
      return []
    } else {
      console.log(error)
      throw error
    }
  }
}

export const getInboundEnergy = async (
  backendApi: AxiosInstance,
  toBrightId: string
): Promise<InboundEnergyAllocationList> => {
  try {
    const res = await backendApi.get<InboundEnergyAllocationRetrieveResponse>(
      '/v1/energy/inbound/' + toBrightId
    )
    if (!res?.data?.energy) {
      throw new Error('Energy data in not defined')
    }
    return res.data.energy
  } catch (error: any) {
    if (error?.response?.data === 'No public key defined for brightId') {
      return []
    } else {
      console.log(error)
      throw error
    }
  }
}
