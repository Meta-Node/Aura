import assert from 'assert'
import CryptoJS from 'crypto-js'
import nacl from 'tweetnacl'
import B64 from 'base64-js'

import { backendApi, brightIdBaseURL, encryptData } from '.'

let qrString
let intervalID

// Authorize in BrightID => Authorize in Backend (Add data about user in DB)
// If we do some request after auth we go to DB and get data about user

const decryptData = (data, aesKey) => {
  const decrypted = CryptoJS.AES.decrypt(data, aesKey).toString(
    CryptoJS.enc.Utf8
  )
  return JSON.parse(decrypted)
}

const b64ToUrlSafeB64 = s => {
  const alts = {
    '/': '_',
    '+': '-',
    '=': '',
  }
  return s.replace(/[/+=]/g, c => alts[c])
}

const hash = data => {
  const h = CryptoJS.SHA256(data)
  const b = h.toString(CryptoJS.enc.Base64)
  return b64ToUrlSafeB64(b)
}

const createImportQR = async () => {
  const array = CryptoJS.lib.WordArray.random(16)
  const aesKey = b64ToUrlSafeB64(CryptoJS.enc.Base64.stringify(array))
  console.log(`aesKey: ${aesKey}`)
  const channelId = hash(aesKey)
  console.log(`channelId: ${channelId}`)

  const { publicKey, secretKey } = await nacl.sign.keyPair()
  const b64PublicKey = B64.fromByteArray(publicKey)
  console.log(`b64PublicKey: ${b64PublicKey}`)
  const b64SecretKey = B64.fromByteArray(secretKey)
  console.log(`b64SecretKey: ${b64SecretKey}`)

  const timestamp = Date.now()
  const dataObj = {
    signingKey: b64PublicKey,
    timestamp,
  }
  const data = JSON.stringify(dataObj)
  const body = JSON.stringify({ data, uuid: 'data' })
  try {
    const res = await backendApi.post(`profile/upload/${channelId}`, body)
    assert.ok(res.ok, 'failed to post data to the channel')
  } catch (error) {
    console.log(error)
  }

  qrString = `${brightIdBaseURL}/profile?aes=${aesKey}&t=3`
  const deeplink = `brightid://connection-code/${encodeURIComponent(qrString)}`
  qrString = deeplink

  console.log(`QR string: ${qrString}`)
  console.log(`Deep link: ${deeplink}`)

  return {
    channelId,
    aesKey,
    signingKey: b64PublicKey,
    privateKey: b64SecretKey,
    timestamp,
    qrString,
    deeplink,
    b64SecretKey,
  }
}

const createSyncQR = async (brightID, signingKey, lastSyncTime) => {
  const array = CryptoJS.lib.WordArray.random(16)
  const aesKey = b64ToUrlSafeB64(CryptoJS.enc.Base64.stringify(array))
  console.log(`aesKey: ${aesKey}`)
  const channelId = hash(aesKey)
  console.log(`channelId: ${channelId}`)
  const dataObj = { signingKey, lastSyncTime, isPrimaryDevice: false }
  const data = JSON.stringify(dataObj)
  let body = JSON.stringify({ data, uuid: 'data' })
  let res = await backendApi.post(`/upload/${channelId}`, body)
  assert.ok(res.ok, 'failed to post data to the channel')

  // although the device has nothing to send for the primary device,
  // it's required to send the completed flag to the channel
  const uuid = `completed_${brightID}:${b64ToUrlSafeB64(signingKey)}`
  body = JSON.stringify({ data: 'completed', uuid })
  res = await backendApi.post(`/upload/${channelId}`, body)
  assert.ok(res.ok, 'failed to post completed flag to the channel')

  qrString = `${brightIdBaseURL}?aes=${aesKey}&t=4`
  console.log(`QR string: ${qrString}`)
  console.log(
    `Deep link: https://brightid://brightid.org/connection-code/${encodeURIComponent(
      qrString
    )}`
  )

  return { channelId, aesKey, signingKey }
}

export const readChannel = async (data, resolve) => {
  let profile
  const connections = []
  const { channelId, aesKey, signingKey } = data
  let res = await backendApi.get(`/profile/list/${channelId}`)

  const dataIds = res.data.profileIds

  const uploader = id => id.replace('completed_', '').split(':')[1]
  const completed = dataIds.find(
    dataId =>
      dataId.startsWith('sig_completed_') &&
      uploader(dataId) !== b64ToUrlSafeB64(signingKey)
  )

  if (!completed) {
    return
  }

  for (const dataId of dataIds) {
    if (dataId.startsWith('sig_userinfo_')) {
      res = await backendApi.get(`profile/download/${channelId}/${dataId}`)
      const encrypted = res.data.data
      const data = decryptData(encrypted, aesKey)
      console.log(data, 'user info')
      profile = data
    }
    if (dataId.startsWith('connection_')) {
      res = await backendApi.get(`profile/download/${channelId}/${dataId}`)
      const encrypted = res.data.data
      const data = decryptData(encrypted, aesKey)
      console.log(data, 'connection')
      connections.push(data)
    }
  }

  clearInterval(intervalID)
  resolve({ profile, connections })
}

export const readChannelPromise = data => {
  return new Promise((resolve, reject) => {
    intervalID = setInterval(() => readChannel(data, resolve), 3000)
  })
}

export const importBrightID = async () => {
  try {
    const data = await createImportQR()

    return data
  } catch (error) {
    console.log(error)
  }
}

export const syncBrightID = async () => {
  const brightID =
    localStorage.getItem('brightID') ||
    '5cvu9DUZyzPUclHHcgNhs0S71Z2nAOwAYAljYgisGgA'
  const signingKey =
    localStorage.getItem('publicKey') ||
    'WPL5WOLMbJ9M2wKbx9QaGOlJcXcIwQ7o8FfdoP+EX5g='

  try {
    const lastSyncTime = localStorage.getItem('timestamp') || 1645509278250
    const data = await createSyncQR(brightID, signingKey, lastSyncTime)
    console.log(data)
  } catch (error) {
    console.log(error)
  }
}

export const commitToBackend = async () => {
  try {
    const brightId = localStorage.getItem('brightId')
    const publicKey = localStorage.getItem('publicKey')

    const encryptedData = {
      timestamp: Date.now(),
    }

    const encryptedTimestamp = encryptData(encryptedData)

    await backendApi.post('/v1/connect', {
      brightId,
      publicKey,
      encryptedTimestamp,
    })
  } catch (error) {
    console.log(error)
    throw error
  }
}
