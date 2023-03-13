import { Plugin } from '@nuxt/types'

const initClient: Plugin = ({ store }) => {
  const localStorageDomainId = localStorage.getItem('activeDomainId')
  if (localStorageDomainId) {
    store.commit('app/setActiveDomainId', localStorageDomainId)
  }
}
export default initClient
