import { backendApi, encryptData } from '.'

export const getConnections = async fromBrightId => {
  const res = await backendApi.get('/v1/connections/search', {
    fromBrightId,
    seed: 5,
  })

  return res
}

export const getConnection = async toBrightId => {
  const fromBrightId = localStorage.getItem('brightId')
  if (!fromBrightId) {
    return
  }

  const res = await backendApi.get(
    '/v1/connections/' + fromBrightId + '/' + toBrightId
  )

  if (!res.data) {
    throw new Error('data is not defined')
  }

  return res.data
}

export const getProfile = async (fromBrightId, isPublic = false) => {
  try {
    let res
    const privateRoute = '/v1/profile/'
    const publicRoute = '/v1/profile/public/'
    const route = isPublic ? publicRoute : privateRoute

    res = await backendApi.get(route + fromBrightId)
    if (res.status === 500) {
      res = await backendApi.get(publicRoute + fromBrightId)
    }
    return res
  } catch (error) {
    throw new Error('profile is not defined')
  }
}

export const setNickname = async ({ fromBrightId, toBrightId, nickname }) => {
  const endpoint = '/v1/nickname/'
  const URL = `${endpoint}${fromBrightId}/${toBrightId}`

  const encryptedData = {
    nickname,
  }

  const encryptedNickname = encryptData(encryptedData)
  const res = await backendApi.post(URL, {
    encryptedNickname,
  })
  return res
}
