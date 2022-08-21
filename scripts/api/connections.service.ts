import { ApiResponse } from 'apisauce'
import { backendApi } from '.'
import { CONNECTION_SEARCH_SEED } from '~/utils/constants'
import { encryptDataWithPrivateKey } from '~/scripts/utils/crypto'
import {
  AuraConnectionsResponse,
  AuraProfile,
  AuraPublicProfile,
  ConnectionResponse,
} from '~/types'

export const getConnections = (fromBrightId: string) => {
  return backendApi.get<AuraConnectionsResponse>('/v1/connections/search', {
    fromBrightId,
    seed: CONNECTION_SEARCH_SEED,
  })
}

export const getConnection = async (toBrightId: string) => {
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

type ProfileApiResponse = ApiResponse<AuraProfile | AuraPublicProfile>
export const getProfile = async (fromBrightId: string, isPublic = false) => {
  try {
    let res: ProfileApiResponse
    let resFinal: ProfileApiResponse & {
      isPublic: boolean
    }
    const privateRoute = '/v1/profile/'
    const publicRoute = '/v1/profile/public/'
    const route = isPublic ? publicRoute : privateRoute
    // TODO: write seperated service for public profile
    res = await backendApi.get<AuraProfile | AuraPublicProfile>(
      route + fromBrightId
    )
    resFinal = { ...res, isPublic }
    if (res.status === 500) {
      res = await backendApi.get<AuraPublicProfile>(publicRoute + fromBrightId)
      resFinal = { ...res, isPublic: true }
    }
    return resFinal
  } catch (error) {
    throw new Error('profile is not defined')
  }
}

export const setNickname = ({
  fromBrightId,
  toBrightId,
  nickname,
}: {
  fromBrightId: string
  toBrightId: string
  nickname: string
}) => {
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
