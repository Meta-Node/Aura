import { create } from 'apisauce'
import nacl from 'tweetnacl'
import B64 from 'base64-js'

export const brightIdBaseURL = 'http://184.72.224.75'

export const brightIdApi = create({
  headers: { 'Cache-Control': 'no-cache' },
  mode: 'no-cors',
})

export const backendApi = create({
  baseURL: 'https://aura-be-staging.herokuapp.com',
  headers: { 'Cache-Control': 'no-cache' },
})

export const encryptData = encryptedData => {
  const privateKey = localStorage.getItem('privateKey')

  if (!privateKey) {
    throw new Error('need secret key stored')
  }

  const utf8Encode = new TextEncoder()
  return nacl.sign(
    utf8Encode.encode(JSON.stringify(encryptedData)),
    B64.toByteArray(privateKey)
  )
}
