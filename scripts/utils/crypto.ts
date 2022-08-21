import CryptoJS from 'crypto-js'

import nacl from 'tweetnacl'
import { fromByteArray, toByteArray } from 'base64-js'
import { BrightIdBackup } from '~/types'

export function encryptData(data: string, password: string) {
  return CryptoJS.AES.encrypt(data, password).toString()
}

export function encryptUserData(userData: BrightIdBackup, password: string) {
  return encryptData(JSON.stringify(userData), password)
}

export function decryptData(data: string, password: string) {
  return CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8)
}

export function decryptUserData(encryptedUserData: string, password: string) {
  return JSON.parse(decryptData(encryptedUserData, password))
}

export const b64ToUrlSafeB64 = (s: string) => {
  const alts: {
    [key: string]: string
  } = {
    '/': '_',
    '+': '-',
    '=': '',
  }
  return s.replace(/[/+=]/g, c => alts[c])
}

export const hash = (data: string) => {
  const h = CryptoJS.SHA256(data)
  const b = h.toString(CryptoJS.enc.Base64)
  return b64ToUrlSafeB64(b)
}

export const randomWordArray = (size: number) =>
  CryptoJS.lib.WordArray.random(size)

export const wordArrayToB64 = (WordArray: CryptoJS.lib.WordArray) =>
  CryptoJS.enc.Base64.stringify(WordArray)

export const generateB64Keypair = () => {
  const { publicKey, secretKey } = nacl.sign.keyPair()
  const b64PublicKey = fromByteArray(publicKey)

  const b64SecretKey = fromByteArray(secretKey)

  return {
    privateKey: b64SecretKey,
    publicKey: b64PublicKey,
  }
}

export const encryptStringWithPrivateKey = (data: string) => {
  const privateKey = process.client && localStorage.getItem('privateKey')

  if (!privateKey) {
    throw new Error('need secret key stored')
  }

  const utf8Encode = new TextEncoder()
  return nacl.sign(utf8Encode.encode(data), toByteArray(privateKey))
}

export const encryptDataWithPrivateKey = (data: any) => {
  return encryptStringWithPrivateKey(JSON.stringify(data))
}
