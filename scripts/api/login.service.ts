import { Store } from 'vuex'
import { AxiosInstance } from 'axios'
import {
  decryptData,
  decryptUserData,
  generateB64Keypair,
  hash,
} from '~/scripts/utils/crypto'
import { RootState } from '~/types/store'

export async function pullDecryptedUserData(
  key: string,
  password: string,
  ctx: Store<RootState>
) {
  return decryptUserData((await pullEncryptedUserData(key, ctx)).data, password)
}

function pullEncryptedUserData(key: string, ctx: Store<RootState>) {
  return ctx.$axios.get<string>(`/brightid/backups/${key}/data`)
}

export async function pullProfilePhoto(
  key: string,
  brightId: string,
  password: string,
  ctx: Store<RootState>
) {
  try {
    const encryptedUserPicture = await ctx.$axios.get(
      `/brightid/backups/${key}/${brightId}`
    )
    return decryptData(encryptedUserPicture.data, password)
  } catch (error) {
    console.log(error)
  }
}

export const loginByExplorerCode = async (
  backendApi: AxiosInstance,
  explorerCode: string,
  password: string
) => {
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
