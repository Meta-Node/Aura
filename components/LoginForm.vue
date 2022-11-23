<template>
  <form class="form" novalidate @submit.prevent="onSubmit">
    <div class="form__login-method">
      <app-button
        v-for="l in LoginMethods"
        :key="l"
        :class="{
              'text-button form__btn-select__selected': loginMethod === l
            }"
        class="text-button form__btn-select"
        @click.prevent="loginMethod = l"
      >
            <span
              :class="{
                 'form__btn-select-text__selected':loginMethod === l
               }"
              class="form__btn-select-text">{{ l }}</span>
      </app-button>
    </div>
    <app-input
      v-show="loginMethod === LoginMethods.explorerCode"
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
    <div v-show="loginMethod === LoginMethods.explorerCode"
         class="form__link">
      <p
        class="form__link__text"
        @click="
          visitLink(
            'https://brightid.gitbook.io/aura/getting-started/aura-login'
          )
        "
      >
        how to find my explorer code
      </p>
    </div>
    <a
      v-show="loginMethod === LoginMethods.localServer"
      :href="openBrightIdUrl" class="form__open-brightid">Open
      BrightID</a>
    <app-input
      v-show="loginMethod === LoginMethods.localServer"
      id="localserver"
      ref="localserver"
      :required="true"
      class="form__input-wrapper"
      data-testid="login-local-server"
      placeholder="WiFi Sharing url 192.168..."
      type="text"
      validation="minLength(10)"
      validation-text="Server address is required"
      @inputValue="onInputValue"
    />
    <app-input
      v-show="loginMethod === LoginMethods.explorerCode"
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
      <label class="checkbox" for="input-checkbox"
      ><span>
          <svg width="12px" height="10px" viewbox="0 0 12 10">
            <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg></span
      ><span>Remember my details</span></label
      >
    </div>
    <div class="form__btn-wrapper">
      <app-button
        :loading="$store.state.app.loading"
        class="text-button form__btn"
        data-testid="login-submit"
        type="submit"
        @click="onSubmit"
      >
        <span class="form__btn-text">Sign In</span>
      </app-button>
    </div>
  </form>
</template>

<script>
import axios from "axios"
import AppInput from '~/components/AppInput.vue'
import AppButton from '~/components/AppButton.vue'
import {TOAST_ERROR} from '~/utils/constants'

const LoginMethods = Object.freeze({
  localServer: 'WiFi Sharing',
  explorerCode: 'Explorer Code',
})
export default {
  components: {AppInput, AppButton},
  data() {
    return {
      openBrightIdUrl: '',
      LoginMethods,
      loginMethod: LoginMethods.localServer,
      hasErrors: true,
      explorer: {
        value: '',
        error: true,
      },
      localserver: {
        value: '',
        error: true,
      },
      password: {
        value: '',
        error: true,
      },
    }
  },
  mounted() {
    this.openBrightIdUrl = 'brightid://local-server?run=true&next=' + window.location.href
    if (this.$store.getters["app/isFirstVisitedRoute"]) {
      this.loginByLocalServer('http://localhost:9025')
    }
  },

  methods: {
    onInputValue(val) {
      this[val.id] = {...this[val.id], ...val}

      this.hasErrors = this.explorer.error || this.password.error
    },
    async loginByExplorerCode() {
      if (this.hasErrors) {
        this.emmitError()
        return
      }
      if (!this.$store.state.app.loading) {
        try {
          this.$store.commit('app/setLoading', true);
          await this.$store.dispatch('login/loginByExplorerCode', {
            explorer: this.explorer.value,
            password: this.password.value,
          })

          this.$store.commit('app/setIsAuth', true);
          this.$router.push('/profile/');
        } catch (error) {
          this.$store.commit('toast/addToast', {
            text: 'Incorrect data',
            color: TOAST_ERROR,
          })
        }
        this.$store.commit('app/setLoading', false);
      }
    },
    async loginByLocalServer(localServerUrl) {
      const localServer = axios.create({
        baseURL: localServerUrl,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      const explorerData = (await localServer.get('/v1/explorer-code')).data
      if (explorerData) {
        const {
          explorerCode,
          password
        } = explorerData
        this.onInputValue({
          id: 'explorer',
          value: explorerCode,
          error: false,
        })
        this.onInputValue({
          id: 'password',
          value: password,
          error: false,
        })
        await this.loginByExplorerCode();
      }
    },
    onSubmit() {
      if (this.loginMethod === LoginMethods.explorerCode) {
        this.loginByExplorerCode()
      } else if (this.loginMethod === LoginMethods.localServer) {
        if (this.localserver.value) {
          const localServerUrl = `${this.localserver.value.startsWith('http://') ? '' : 'http://'}${this.localserver.value}`
          this.loginByLocalServer(localServerUrl);
        }
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
    visitLink(link) {
      window.open(link, '_blank')
    },
  }
}
</script>
