<template>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <app-input
      id="explorer"
      ref="explorer"
      class="form__input-wrapper"
      type="text"
      placeholder="Explorer Code"
      validation="minLength(88)"
      validation-text="Value length must be equal 88"
      :required="true"
      @inputValue="onInputValue"
    />
    <app-input
      id="password"
      ref="password"
      class="form__input-wrapper"
      type="password"
      validation="required"
      validation-text="Password is required"
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
      <!-- <label class="checkbox" for="input-checkbox"
        ><span>
          <svg width="12px" height="10px" viewbox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
        ><span>Remember my details</span></label
      > -->
    </div>
    <div class="form__btn-wrapper">
      <app-button type="submit" class="text-button form__btn">
        <span class="form__btn-text">Sign In</span>
      </app-button>
      <bright-id-login />
    </div>
  </form>
</template>

<script>
import BrightIdLogin from './BrightIdLogin.vue'
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'

export default {
  components: { BrightIdLogin, AppInput, AppButton },

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
    }
  },

  methods: {
    onInputValue(val) {
      this[val.id] = { ...this[val.id], ...val }

      this.hasErrors = this.explorer.error || this.password.error
    },
    async onSubmit() {
      if (this.hasErrors) {
        this.emmitError()
        return
      }

      await this.$store.dispatch('login/loginByExplorerCode', {
        explorer: this.explorer.value,
        password: this.password.value,
      })

      this.$store.commit('app/setIsAuth', true)
      this.$router.push('/profile/')
    },

    emmitError() {
      this.$refs.explorer.throwError()
      this.$refs.password.throwError()
    },

    resetForm() {
      this.$refs.explorer.value = ''
      this.$refs.password.value = ''

      this.hasErrors = false
    },
  },
}
</script>
