import assert from 'assert'
import nacl from 'tweetnacl'
import B64 from 'base64-js'

import { backendApi, brightIdBaseURL } from '.'
import {
  b64ToUrlSafeB64,
  decryptData,
  decryptUserData,
  encryptDataWithPrivateKey,
  generateB64Keypair,
  hash,
  randomWordArray,
  wordArrayToB64,
} from '~/scripts/utils/crypto'

let qrString
let intervalID

const createImportQR = async () => {
  const array = randomWordArray(16)
  const aesKey = b64ToUrlSafeB64(wordArrayToB64(array))

  const channelId = hash(aesKey)

  const { publicKey, secretKey } = await nacl.sign.keyPair()
  const b64PublicKey = B64.fromByteArray(publicKey)

  const b64SecretKey = B64.fromByteArray(secretKey)

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
  const array = randomWordArray(16)
  const aesKey = b64ToUrlSafeB64(wordArrayToB64(array))

  const channelId = hash(aesKey)

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

  return { channelId, aesKey, signingKey }
}

export const readChannel = async (data, nuxtCtx, resolve) => {
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

  nuxtCtx.commit('app/setLoading', true, { root: true })

  for (const dataId of dataIds) {
    if (dataId.startsWith('sig_userinfo_')) {
      res = await backendApi.get(`profile/download/${channelId}/${dataId}`)
      const encrypted = res.data.data
      const data = decryptUserData(encrypted, aesKey)
      if (data.password) {
        delete data.password
      }
      console.log(data, 'user info')
      profile = data
    }
    if (dataId.startsWith('connection_')) {
      res = await backendApi.get(`profile/download/${channelId}/${dataId}`)
      const encrypted = res.data.data
      const data = decryptUserData(encrypted, aesKey)
      console.log(data, 'connection')
      connections.push(data)
    }
  }

  clearInterval(intervalID)
  resolve({ profile, connections })
}

export const readChannelPromise = (data, nuxtCtx) => {
  return new Promise((resolve, reject) => {
    intervalID = setInterval(() => readChannel(data, nuxtCtx, resolve), 3000)
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
    localStorage.getItem('brightId') ||
    '5cvu9DUZyzPUclHHcgNhs0S71Z2nAOwAYAljYgisGgA'
  const signingKey =
    localStorage.getItem('publicKey') ||
    'WPL5WOLMbJ9M2wKbx9QaGOlJcXcIwQ7o8FfdoP+EX5g='

  try {
    const lastSyncTime = localStorage.getItem('timestamp') || 1645509278250
    await createSyncQR(brightID, signingKey, lastSyncTime)
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

    const encryptedTimestamp = encryptDataWithPrivateKey(encryptedData)

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

export async function pullDecryptedUserData(key, password, ctx) {
  return decryptUserData((await pullEncryptedUserData(key, ctx)).data, password)
}

async function pullEncryptedUserData(key, ctx) {
  return await ctx.$axios.get(`/brightid/backups/${key}/data`)
}

export async function pullProfilePhoto(key, brightId, password, ctx) {
  try {
    const encryptedUserPicture = await ctx.$axios.get(
      `/brightid/backups/${key}/${brightId}`
    )
    return decryptData(encryptedUserPicture.data, password)
  } catch (error) {
    console.log(error)
  }
}

export const loginByExplorerCode = async (explorerCode, password) => {
  try {
    const brightId = decryptData(explorerCode, password)

    if (!brightId) {
      throw new Error('incorrect explorerCode or password')
    }

    const authKey = hash(brightId + password)

    const { publicKey, privateKey } = generateB64Keypair()

    const body = {
      publicKey,
      brightId,
      key: authKey,
      password,
    }

    await backendApi.post('/v1/connect/explorer-code', body)

    return {
      publicKey,
      brightId,
      authKey,
      privateKey,
      password,
    }
  } catch (error) {
    throw error
  }
}
