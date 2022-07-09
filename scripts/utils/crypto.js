import CryptoJS from 'crypto-js'

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
