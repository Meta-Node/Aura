import { backendApi } from '.'

export const getConnections = async fromBrightId => {
  // search
  const res = await backendApi.get('/v1/connections/search', {
    fromBrightId,
    seed: 5,
  })

  return res
}

export const getProfile = async fromBrightId => {
  // search
  const res = await backendApi.get('/v1/profile/' + fromBrightId)
  return res
}
