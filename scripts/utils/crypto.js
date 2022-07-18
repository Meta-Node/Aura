import CryptoJS from 'crypto-js'
import nacl from 'tweetnacl'
import B64 from 'base64-js'

export function encryptData(data, password) {
  return CryptoJS.AES.encrypt(data, password).toString()
}

export function encryptUserData(userData, password) {
  return encryptData(JSON.stringify(userData), password)
}

export function decryptData(data, password) {
  return CryptoJS.AES.decrypt(data, password).toString(CryptoJS.enc.Utf8)
}

export function decryptUserData(encryptedUserData, password) {
  return JSON.parse(decryptData(encryptedUserData, password))
}

export const b64ToUrlSafeB64 = s => {
  const alts = {
    '/': '_',
    '+': '-',
    '=': '',
  }
  return s.replace(/[/+=]/g, c => alts[c])
}

export const hash = data => {
  const h = CryptoJS.SHA256(data)
  const b = h.toString(CryptoJS.enc.Base64)
  return b64ToUrlSafeB64(b)
}

export const randomWordArray = size => CryptoJS.lib.WordArray.random(size)

export const wordArrayToB64 = WordArray =>
  CryptoJS.enc.Base64.stringify(WordArray)

export const generateB64Keypair = () => {
  const { publicKey, secretKey } = nacl.sign.keyPair()
  const b64PublicKey = B64.fromByteArray(publicKey)

  const b64SecretKey = B64.fromByteArray(secretKey)

  return {
    privateKey: b64SecretKey,
    publicKey: b64PublicKey,
  }
}

export const encryptDataWithPrivateKey = encryptedData => {
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
