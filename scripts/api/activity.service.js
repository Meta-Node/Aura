import { backendApi } from '.'

export const getProfileActivity = async fromBrightId => {
  // search
  const res = await backendApi.get('v1/activityLog/detail/' + fromBrightId)
  return res
}
