import { backendApi } from '.'

export const getProfileActivity = async fromBrightId => {
  const res = await backendApi.get(
    'v1/activityLog/detail/' + fromBrightId + '?limit=200'
  )
  return res
}

export const getGlobalActivity = async () => {
  const res = await backendApi.get('v1/activityLog/general?limit=200')
  return res
}

export const setImportantActivity = async (activityId, isImportant) => {
  const res = await backendApi.post('v1/activityLog/' + activityId, {
    isImportant,
  })
  return res
}
