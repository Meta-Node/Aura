import {AxiosInstance, AxiosResponse} from 'axios'
import {CONNECTION_SEARCH_SEED} from '~/utils/constants'
import {encryptDataWithPrivateKey} from '~/scripts/utils/crypto'
import {
  AuraConnectionsResponse,
  AuraProfile,
  AuraPublicProfile,
  ConnectionResponse,
  IncomingConnectionsResponse,
} from '~/types'

export const getConnections = (
  backendApi: AxiosInstance,
  fromBrightId: string
) => {
  return backendApi.get<AuraConnectionsResponse>('/v1/connections/search', {
    params: {
      fromBrightId,
      seed: CONNECTION_SEARCH_SEED,
    },
  })
}

export const getIncomingConnections = async (
  brightIdNodeApi: AxiosInstance,
  toBrightId: string
) => {
  const res = await brightIdNodeApi.get<IncomingConnectionsResponse>(
    `/node/v6/users/${toBrightId}/connections/inbound`
  )
  return res.data.data.connections
}

export const getConnection = async (
  backendApi: AxiosInstance,
  toBrightId: string
) => {
  const fromBrightId = localStorage.getItem('brightId')
  if (!fromBrightId) {
    return
  }

  const res = await backendApi.get<ConnectionResponse>(
    '/v1/connections/' + fromBrightId + '/' + toBrightId
  )

  if (!res.data) {
    throw new Error('data is not defined')
  }

  return res.data
}

type ProfileApiResponse = AxiosResponse<AuraProfile | AuraPublicProfile>
export const getProfile = async (
  backendApi: AxiosInstance,
  fromBrightId: string,
  isPublic = false
) => {
  let res: ProfileApiResponse
  let resFinal: ProfileApiResponse & {
    isPublic: boolean
  }
  const privateRoute = '/v1/profile/'
  const publicRoute = '/v1/profile/public/'
  const route = isPublic ? publicRoute : privateRoute
  try {
    // TODO: write seperated service for public profile
    res = await backendApi.get<AuraProfile | AuraPublicProfile>(
      route + fromBrightId
    )
    resFinal = {...res, isPublic}
  } catch (error: any) {
    if (error?.response?.status === 500) {
      res = await backendApi.get<AuraPublicProfile>(publicRoute + fromBrightId)
      resFinal = {...res, isPublic: true}
    } else {
      throw new Error('profile is not defined')
    }
  }
  return resFinal
}

export const setNickname = (
  backendApi: AxiosInstance,
  {
    fromBrightId,
    toBrightId,
    nickname,
  }: {
    fromBrightId: string
    toBrightId: string
    nickname: string
  }
) => {
  const endpoint = '/v1/nickname/'
  const URL = `${endpoint}${fromBrightId}/${toBrightId}`

  const encryptedData = {
    nickname,
  }

  const encryptedNickname = encryptDataWithPrivateKey(encryptedData)
  return backendApi.post(URL, {
    encryptedNickname,
  })
}
