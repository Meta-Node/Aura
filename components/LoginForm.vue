<template>
  <form class="form" novalidate @submit="onSubmit">
    <app-input
      id="explorer"
      ref="explorer"
      class="form__input-wrapper"
      type="text"
      placeholder="Explorer Code"
      validation="minLength(10)"
      validation-text="Value must be longer than 10"
      :required="true"
      @inputValue="onInputValue"
    />
    <app-input
      id="password"
      ref="password"
      class="form__input-wrapper"
      type="password"
      validation="minLength(6)"
      validation-text="Password must be longer than 6"
      placeholder="Password"
      :required="true"
      @inputValue="onInputValue"
    />
    <div class="checkbox-wrapper">
      <input
        id="input-checkbox"
        class="input-checkbox"
        type="checkbox"
        style="display: none"
        checked="checked"
      />
      <label class="checkbox" for="input-checkbox"
        ><span>
          <svg width="12px" height="10px" viewbox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
        ><span>Remember my details</span></label
      >
    </div>
    <div class="form__btn-wrapper">
      <app-button
        type="submit"
        class="text-button form__btn"
        :disabled="hasErrors"
      >
        <span class="form__btn-text">Sign In</span>
      </app-button>
      <app-button
        class="text-button form__btn brightid__btn"
        @click.native="onBrightIdClick"
      >
        <span class="form__btn-icon"
          ><svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.02002 5.61503V8.21795C6.02002 9.65568 7.18546 10.8211 8.62311 10.8211C10.0608 10.8211 11.2261 9.65568 11.2261 8.21795C11.2261 6.78031 10.0608 5.61487 8.62311 5.61487C8.6199 5.61487 8.61677 5.61511 8.61356 5.61511V5.61503H6.02002Z"
              fill="#EEEEEE"
            />
            <path
              d="M9.03401 0H7.98484H6.02015V3.01181H8.61369V3.01205C8.61689 3.01205 8.62002 3.01181 8.62323 3.01181C11.4984 3.01181 13.8294 5.3426 13.8294 8.21806C13.8294 11.0934 11.4984 13.4242 8.62323 13.4242C5.74794 13.4242 3.41698 11.0934 3.41698 8.21806V5.61506H0.480957V7.9972H0.50013C0.503668 12.4177 4.0882 16 8.50943 16C12.9329 16 16.519 12.4141 16.519 7.99054C16.519 3.74334 13.2127 0.270479 9.03401 0Z"
              fill="#EEEEEE"
            />
            <path d="M3.40887 0H0.499512V3.03386H3.40887V0Z" fill="#EEEEEE" />
          </svg>
        </span>
        <span class="form__btn-text">Sign In with BrightID</span>
      </app-button>
    </div>
    <qr-popup ref="popup" :bright-id-data="brightIDData" />
  </form>
</template>

<script>
import QrPopup from './QrPopup.vue'
import AppInput from '~/components/AppInput.vue'
import { importBrightID } from '~/scripts/login'
export default {
  components: { AppInput, QrPopup },

  data() {
    return {
      hasErrors: true,
      explorer: {
        value: '',
        error: true,
      },
      password: {
        value: '',
        error: true,
      },
      brightIDData: {},
    }
  },

  methods: {
    onInputValue(val) {
      this[val.id] = { ...this[val.id], ...val }

      this.hasErrors = this.explorer.error || this.password.error
    },
    onSubmit(e) {
      e.preventDefault()

      if (!this.hasErrors) {
        this.$store.commit('app/setIsAuth', true)
        this.$router.push('/profile')
        this.$refs.explorer.reset()
        this.$refs.password.reset()
      }
    },
    async onBrightIdClick() {
      const data = await importBrightID()
      this.brightIDData = data
      console.log(this.brightIDData)

      this.$refs.popup.openPopup()
    },
  },
}
</script>