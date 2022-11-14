<template>
  <section class="contact-us">
    <div class="container contact-us__wrapper" style="padding-top: 30px; word-wrap: break-word">
      <hr/>
      Encrypt with password
      <AppInput
        v-model="password"
        placeholder="password"
        style="margin: 10px 0px 10px 0px;"
      ></AppInput>
      <AppInput
        v-model="d1"
        placeholder="data to encrypt"
        style="margin: 0px 0px 10px 0px;"
        type="textarea"
      ></AppInput>
      <p>Encrypted Data:<br/>{{ encrypted }}</p>
      <hr/>
      Decrypt with password
      <AppInput
        v-model="password"
        placeholder="password"
        style="margin: 20px 0px 10px 0px;"
      ></AppInput>
      <AppInput
        v-model="d2"
        placeholder="data to decrypt"
        style="margin: 0px 0px 10px 0px;"
        type="textarea"
      ></AppInput>
      <p>Decrypted Data:<br/>{{ decrypted }}</p>
      <hr/>
      Encrypt with PrivateKey
      <AppInput
        v-model="d3"
        placeholder="data to encrypt with private key (must be loggeed in)"
        style="margin: 10px 0px"
        type="textarea"
      ></AppInput>
      <p>PrivateKey: {{ privateKey }}</p><br/>
      <p>PublicKey: {{ publicKey }}</p><br/>
      <p>Encrypted:<br/>{{ encryptedWithPrivateKey }}<br/><br/>{{ JSON.stringify(encryptedWithPrivateKey) }}</p>
    </div>
  </section>
</template>

<script>
import {decryptData, encryptData, encryptStringWithPrivateKey} from "~/scripts/utils/crypto";

export default {
  data: function () {
    return {
      privateKey: '',
      publicKey: '',
      password: '',
      d1: '',
      d2: '',
      d3: '',
    };
  },
  computed: {
    encrypted() {
      return encryptData(this.d1, this.password)
    },
    decrypted() {
      return decryptData(this.d2, this.password)
    },
    encryptedWithPrivateKey() {
      return process.client && encryptStringWithPrivateKey(this.d3)
    }
  },
  mounted() {
    this.privateKey = localStorage.getItem('privateKey')
    this.publicKey = localStorage.getItem('publicKey')
    this.$localForage.getItem('profileData').then(profileInfo => {
      this.password = profileInfo.profile.password
    })
  }
}
</script>

<style scoped>

</style>
