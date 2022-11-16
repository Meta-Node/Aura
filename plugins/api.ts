import { Plugin } from '@nuxt/types'
import axios, { AxiosInstance } from 'axios'
import { isThereProblemWithEncryption } from '~/utils'

declare module 'vue/types/vue' {
  interface Vue {
    $backendApi: AxiosInstance
    $brightIdNodeApi: AxiosInstance
    $auraBrightIdNodeApi: AxiosInstance
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $backendApi: AxiosInstance
    $brightIdNodeApi: AxiosInstance
    $auraBrightIdNodeApi: AxiosInstance
  }

  interface Context {
    $backendApi: AxiosInstance
    $brightIdNodeApi: AxiosInstance
    $auraBrightIdNodeApi: AxiosInstance
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
  interface Store<S> {
    $backendApi: AxiosInstance
    $brightIdNodeApi: AxiosInstance
    $auraBrightIdNodeApi: AxiosInstance
  }
}

const api: Plugin = ({ store }, inject) => {
  const backendApi = axios.create({
    baseURL: process.env.API_URL,
    headers: { 'Cache-Control': 'no-cache' },
  })

  const auraBrightIdNodeApi = axios.create({
    headers: { 'Cache-Control': 'no-cache' },
    baseURL: process.env.AURA_NODE_URL,
    // @ts-ignore
    mode: 'no-cors',
  })

  const brightIdNodeApi = axios.create({
    headers: { 'Cache-Control': 'no-cache' },
    baseURL: 'https://app.brightid.org/',
    // @ts-ignore
    mode: 'no-cors',
  })

  backendApi.interceptors.response.use(
    response => response,
    error =>
      new Promise((_resolve, reject) => {
        if (isThereProblemWithEncryption(error.response?.data)) {
          store
            .dispatch('login/refreshKeyPair')
            .then(() => {
              reject(new Error('retryRequest'))
            })
            .catch(_e => {
              console.log(_e)
              reject(error)
            })
        } else {
          reject(error)
        }
      })
  )
  inject('backendApi', backendApi)
  inject('auraBrightIdNodeApi', auraBrightIdNodeApi)
  inject('brightIdNodeApi', brightIdNodeApi)
}

export default api
