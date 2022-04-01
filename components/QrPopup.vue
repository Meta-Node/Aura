<template>
  <app-popup ref="popup">
    <div class="popup__qr">
      <div class="popup__qr-popup">
        <h4 class="popup__qr-text">Scan this QR with your BrightID app</h4>
        <div class="popup__qr-img">
          <canvas id="qr"></canvas>
        </div>
        <app-button class="popup__qr-btn" @click.native="readChanelClick"
          >Confirm
        </app-button>
      </div>
    </div>
  </app-popup>
</template>

<script>
import AppPopup from './AppPopup.vue'
import { readChannel } from '~/scripts/login'
export default {
  components: {
    AppPopup,
  },

  props: {
    brightIdData: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    async openPopup() {
      this.$refs.popup.openPopup()

      const { default: QRious } = await import('qrious')
      new QRious({
        element: document.getElementById('qr'),
        value: this.brightIdData.qrString,
        background: '#1f1f1f',
        foreground: '#ffffff',
        size: 200,
      })
    },

    async readChanelClick() {
      const { profile } = await readChannel(this.brightIdData)
      if (profile) {
        this.$store.commit('profile/setProfile', profile)
      }
      this.$refs.popup.closePopup()
      this.$store.commit('app/setIsAuth', true)
      this.$router.push('/profile')
    },
  },
}
</script>