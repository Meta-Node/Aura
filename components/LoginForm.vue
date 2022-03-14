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
    <button type="submit" class="text-button form__btn" :disabled="hasErrors">
      <span class="form__btn-text">Sign In</span>
    </button>
  </form>
</template>

<script>
import AppInput from '~/components/AppInput.vue'
export default {
  components: { AppInput },

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
    onSubmit(e) {
      e.preventDefault()

      if (!this.hasErrors) {
        this.$store.commit('app/setIsAuth', true)
        this.$router.push('/profile')
        this.$refs.explorer.reset()
        this.$refs.password.reset()
      }
    },
  },
}
</script>