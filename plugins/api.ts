import { Plugin } from '@nuxt/types'
import axios, { AxiosInstance } from 'axios'
import { isThereProblemWithEncryption } from '~/utils'

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue {
    $backendApi: AxiosInstance
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $backendApi: AxiosInstance
  }

  // nuxtContext.$myInjectedFunction
  interface Context {
    $backendApi: AxiosInstance
  }
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface Store<S> {
    $backendApi: AxiosInstance
  }
}

const api: Plugin = ({ store }, inject) => {
  const backendApi = axios.create({
    baseURL: process.env.API_URL,
    headers: { 'Cache-Control': 'no-cache' },
  })
  backendApi.interceptors.response.use(
    response => response,
    error =>
      new Promise((_resolve, reject) => {
        if (isThereProblemWithEncryption(error.response?.data)) {
          store
            .dispatch('login/refreshKeyPair')
            .then(() => {
              console.log('refreshed!')
              reject(new Error('retryRequest'))
            })
            .catch(_e => {
              console.log('refreshed error!')
              console.log(_e)
              reject(error)
            })
        } else {
          reject(error)
        }
      })
  )
  inject('backendApi', backendApi)
}

export default api
