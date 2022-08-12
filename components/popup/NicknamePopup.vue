<template>
  <app-popup ref="popup">
    <div class="nickname-popup">
      <h4 class="popup__text">Enter a new username</h4>
      <form class="nickname-form" novalidate @submit.prevent="onSubmit">
        <app-input
          id="nickname"
          ref="nickname"
          :required="true"
          class="form__input-wrapper"
          placeholder="New Nickname"
          type="text"
          validation="minLength(2)"
          validation-text="Value must be longer than 2"
          @input="oninput"
        />
        <app-button class="nickname-form__btn">Submit</app-button>
      </form>
    </div>
  </app-popup>
</template>

<script>
import AppPopup from './AppPopup.vue'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'
import {setNickname} from '~/scripts/api/connections.service'
import {TOAST_ERROR, TOAST_SUCCESS} from "~/utils/constants";

export default {
  components: {AppPopup, AppInput, AppButton},
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
    oninput(val) {
      this[val.id] = {...this[val.id], ...val}

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
          this.$store.commit('toast/addToast', {
            text: 'Succesfully updated',
            color: TOAST_SUCCESS,
          })
          this.$emit('updateNickname', this.nickname.value)
        } catch (error) {
          console.log(error)
          this.$store.commit('toast/addToast', {
            text: 'Error',
            color: TOAST_ERROR,
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
