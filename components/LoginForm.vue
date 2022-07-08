<template>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <app-input
      id="explorer"
      ref="explorer"
      :required="true"
      class="form__input-wrapper"
      data-testid="login-explorer-code"
      placeholder="Explorer Code"
      type="text"
      validation="minLength(88)"
      validation-text="Value length must be equal 88"
      @inputValue="onInputValue"
    />
    <app-input
      id="password"
      ref="password"
      :required="true"
      class="form__input-wrapper"
      data-testid="login-password"
      placeholder="Password"
      type="password"
      validation="required"
      validation-text="Password is required"
      @inputValue="onInputValue"
    />
    <div class="checkbox-wrapper">
      <input
        id="input-checkbox"
        checked="checked"
        class="input-checkbox"
        style="display: none"
        type="checkbox"
      />
      <!-- <label class="checkbox" for="input-checkbox"
        ><span>
          <svg width="12px" height="10px" viewbox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
        ><span>Remember my details</span></label
      > -->
    </div>
    <div class="form__btn-wrapper">
      <app-button class="text-button form__btn" data-testid="login-submit" type="submit">
        <span class="form__btn-text">Sign In</span>
      </app-button>
      <!-- <bright-id-login /> -->
    </div>
  </form>
</template>

<script>
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'

export default {
  components: {AppInput, AppButton},

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
      this[val.id] = {...this[val.id], ...val}

      this.hasErrors = this.explorer.error || this.password.error
    },
    async onSubmit() {
      if (this.hasErrors) {
        this.emmitError()
        return
      }

      try {
        await this.$store.dispatch('login/loginByExplorerCode', {
          explorer: this.explorer.value,
          password: this.password.value,
        })

        this.$store.commit('app/setIsAuth', true)
        this.$router.push('/profile/')
      } catch (error) {
        this.$store.commit('toast/addToast', {
          text: 'Incorrect data',
          color: 'danger',
        })
      }
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
