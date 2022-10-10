import { create } from 'apisauce'

export const brightIdBaseURL = 'http://184.72.224.75'

export const brightIdApi = create({
  headers: { 'Cache-Control': 'no-cache' },
  // @ts-ignore
  mode: 'no-cors',
})

export const brightIdNodeApi = create({
  headers: { 'Cache-Control': 'no-cache' },
  baseURL: 'https://app.brightid.org/',
  // @ts-ignore
  mode: 'no-cors',
})

export const auraBrightIdNodeApi = create({
  headers: { 'Cache-Control': 'no-cache' },
  baseURL: 'https://aura-node.brightid.org/',
  // @ts-ignore
  mode: 'no-cors',
})

export const backendApi = create({
  baseURL: process.env.API_URL,
  headers: { 'Cache-Control': 'no-cache' },
})
