import { backendApi } from '.'

export const getProfileActivity = (fromBrightId: string) => {
  return backendApi.get('v1/activityLog/detail/' + fromBrightId + '?limit=200')
}

export const getGlobalActivity = () => {
  return backendApi.get('v1/activityLog/general?limit=200')
}

// TODO: determine input types
export const setImportantActivity = (activityId: any, isImportant: any) => {
  return backendApi.post('v1/activityLog/' + activityId, {
    isImportant,
  })
}
