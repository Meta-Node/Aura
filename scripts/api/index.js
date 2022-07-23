import { create } from 'apisauce'

export const brightIdBaseURL = 'http://184.72.224.75'

export const brightIdApi = create({
  headers: { 'Cache-Control': 'no-cache' },
  mode: 'no-cors',
})

export const backendApi = create({
  baseURL: process.env.API_URL,
  headers: { 'Cache-Control': 'no-cache' },
})
