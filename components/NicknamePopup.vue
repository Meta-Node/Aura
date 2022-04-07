<template>
  <app-popup ref="popup">
    <div class="nickname-popup">
      <h4 class="popup__text">Enter a new username</h4>
      <form class="nickname-form" novalidate @submit.prevent="onSubmit">
        <app-input
          id="nickname"
          ref="nickname"
          class="form__input-wrapper"
          type="text"
          placeholder="New Nickname"
          validation="minLength(2)"
          validation-text="Value must be longer than 2"
          :required="true"
          @inputValue="onInputValue"
        />
        <app-button class="nickname-form__btn">Submit</app-button>
      </form>
    </div>
  </app-popup>
</template>

<script>
import AppButton from './AppButton.vue'
import AppInput from './AppInput.vue'
import AppPopup from './AppPopup.vue'
import { setNickname } from '~/scripts/api/connections.service'
export default {
  components: { AppPopup, AppInput, AppButton },
  props: {
    toBrightId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      hasErrors: true,
      nickname: {
        value: '',
        error: true,
      },
    }
  },
  methods: {
    onInputValue(val) {
      this[val.id] = { ...this[val.id], ...val }

      this.hasErrors = this.nickname.error
    },
    async onSubmit() {
      if (!this.hasErrors) {
        try {
          await setNickname({
            nickname: this.nickname.value,
            fromBrightId: localStorage.getItem('brightId'),
            toBrightId: this.toBrightId,
          })
          this.$refs.nickname.reset()
          this.closePopup()
        } catch (error) {
          console.log(error)
          this.$store.commit('toast/addToast', {
            text: 'Error',
            color: 'danger',
          })
        }
      }
    },
    openPopup() {
      this.$refs.popup.openPopup()
    },
    closePopup() {
      this.$refs.popup.closePopup()
    },
  },
}
</script>