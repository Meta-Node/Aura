import { create } from 'apisauce'

// const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

export const brightIdBaseURL = 'http://184.72.224.75'

// const utf8Encode = new TextEncoder()
// const mobileBaseURL = 'brightid://'
export const brightIdApi = create({
  baseURL: brightIdBaseURL,
  headers: { 'Cache-Control': 'no-cache' },
})

export const backendApi = create({
  // baseURL: 'http://localhost:8080',
  baseURL: 'https://aura-be-staging.herokuapp.com',
  headers: { 'Cache-Control': 'no-cache' },
})
