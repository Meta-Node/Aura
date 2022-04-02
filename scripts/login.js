import assert from 'assert'
import CryptoJS from 'crypto-js'
import nacl from 'tweetnacl'
import B64 from 'base64-js'
import { create } from 'apisauce'
import qrcode from 'qrcode-terminal'

let qrString
let intervalID

const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

const baseURL = protocol + '://184.72.224.75'
// const mobileBaseURL = 'brightid://'
const api = create({
  baseURL,
  headers: { 'Cache-Control': 'no-cache' },
})

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

  const dataObj = {
    signingKey: b64PublicKey,
    timestamp: Date.now(),
  }
  const data = JSON.stringify(dataObj)
  const body = JSON.stringify({ data, uuid: 'data' })
  try {
    const res = await api.post(`profile/upload/${channelId}`, body)
    assert.ok(res.ok, 'failed to post data to the channel')
  } catch (error) {
    console.log(error)
  }

  qrString = `${baseURL}/profile?aes=${aesKey}&t=3`
  const deeplink = `brightid://connection-code/${encodeURIComponent(qrString)}`

  console.log(`QR string: ${qrString}`)
  console.log(`Deep link: ${deeplink}`)
  qrcode.generate(deeplink, { small: true })
  return { channelId, aesKey, signingKey: b64PublicKey, qrString }
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
  let res = await api.post(`/upload/${channelId}`, body)
  assert.ok(res.ok, 'failed to post data to the channel')

  // although the device has nothing to send for the primary device,
  // it's required to send the completed flag to the channel
  const uuid = `completed_${brightID}:${b64ToUrlSafeB64(signingKey)}`
  body = JSON.stringify({ data: 'completed', uuid })
  res = await api.post(`/upload/${channelId}`, body)
  assert.ok(res.ok, 'failed to post completed flag to the channel')

  qrString = `${baseURL}?aes=${aesKey}&t=4`
  console.log(`QR string: ${qrString}`)
  console.log(
    `Deep link: https://brightid://brightid.org/connection-code/${encodeURIComponent(
      qrString
    )}`
  )
  qrcode.generate(qrString, { small: true })
  return { channelId, aesKey, signingKey }
}

export const readChannel = async data => {
  let profile
  const connections = []
  const { channelId, aesKey, signingKey } = data
  let res = await api.get(`/profile/list/${channelId}`)

  const dataIds = res.data.profileIds

  console.log(dataIds)

  const uploader = id => id.replace('completed_', '').split(':')[1]
  const completed = dataIds.find(
    dataId =>
      dataId.startsWith('sig_completed_') &&
      uploader(dataId) !== b64ToUrlSafeB64(signingKey)
  )
  console.log(completed)
  if (!completed) {
    return
  }

  for (const dataId of dataIds) {
    if (dataId.startsWith('sig_userinfo_')) {
      res = await api.get(`profile/download/${channelId}/${dataId}`)
      const encrypted = res.data.data
      const data = decryptData(encrypted, aesKey)
      console.log(data, 'user info')
      profile = data
    }
    if (dataId.startsWith('connection_')) {
      res = await api.get(`profile/download/${channelId}/${dataId}`)
      const encrypted = res.data.data
      const data = decryptData(encrypted, aesKey)
      console.log(data, 'connection')
      connections.push(data)
    }
  }

  // clearInterval(intervalID)
  return { profile, connections }
}

export const importBrightID = async () => {
  try {
    const data = await createImportQR()
    console.log(data)
    return data
  } catch (error) {
    console.log(error)
  }
}

export const syncBrightID = async () => {
  const brightID = '5cvu9DUZyzPUclHHcgNhs0S71Z2nAOwAYAljYgisGgA' // the brightid of the user
  const signingKey = 'WPL5WOLMbJ9M2wKbx9QaGOlJcXcIwQ7o8FfdoP+EX5g=' // use b64PublicKey created in import step
  try {
    const lastSyncTime = 1645509278250 // last sync (or import) timestamp in milliseconds
    const data = await createSyncQR(brightID, signingKey, lastSyncTime)
    console.log(data)
    intervalID = setInterval(() => readChannel(data), 3000)
  } catch (error) {
    console.log(error)
  }
}
