import { backendApi, encryptData } from '.'

export const getConnections = async fromBrightId => {
  const res = await backendApi.get('/v1/connections/search', {
    fromBrightId,
    seed: 5,
  })

  return res
}

export const getProfile = async fromBrightId => {
  const res = await backendApi.get('/v1/profile/' + fromBrightId)
  return res
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
