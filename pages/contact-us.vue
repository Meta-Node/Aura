<template>
  <section class="contact-us app-page">
    <div class="container contact-us__wrapper">
      <h3 class="contact-us__title">Contact Us</h3>
      <div class="contact-us__body">
        <div class="contact-us__link-with-icon">
          <p class="contact-us__link-with-icon__link" @click="visitLink('https://discord.gg/zFXKG77vq3')">
            Join Aura's Discord Channel
          </p>
        </div>

        <p class="contact-us__text">
          If you have any questions, feedbacks, bugs, or suggestions, please
          feel free to contact us. fill out the form below and we will get back
          to you as soon as possible.
        </p>
        <AppInput
          v-model="email"
          data-testid="contact-us-email"
          placeholder="email (optional)"
          style="margin: 0 0 20px 0; width: 100%"
        ></AppInput>
        <AppSelectInput
          :options="feedbackOptions"
          :selected-item="selectedFeedbackOption"
          data-testid="contact-us-category"
          placeholder="-- feedback type * --"
          style="margin: 0 0 20px 0; width: 100%"
          @handleItemClicked="setSelectedFeedbackOption"
        />
        <AppInput
          v-model="body"
          data-testid="contact-us-text"
          placeholder="description *"
          style="margin: 0 0 20px 0; width: 100%"
          type="textarea"
        ></AppInput>
        <AppButton :loading="loading" data-testid="contact-us-submit" @click="handleSendFeedback">Send</AppButton>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppSelectInput from '@/components/AppSelectInput.vue'
import {TOAST_ERROR, TOAST_SUCCESS} from "~/utils/constants";
import {encryptDataWithPrivateKey} from "~/scripts/utils/crypto";

export default {
  components: {
    AppInput,
    AppButton,
    AppSelectInput,
  },
  data() {
    return {
      canSendRequest: true,
      body: '',
      email: '',
      selectedFeedbackOption: null,
      feedbackOptions: [
        {
          id: 'Question',
          title: 'Question'
        },
        {
          id: 'Suggestion',
          title: 'Suggestion',
        },
        {
          id: 'Bug',
          title: 'Bug',
        },
        {
          id: 'Other',
          title: 'Other',
        },
      ],
    }
  },
  computed: {
    loading() {
      return this.$store.state.app.loading
    }
  },
  methods: {
    async handleSendFeedback() {
      if (!this.canSendRequest) return
      if (!this.body) {
        this.$store.commit('toast/addToast', {text: 'Please write your feedback', color: TOAST_ERROR})
        return
      }
      if (!this.selectedFeedbackOption) {
        this.$store.commit('toast/addToast', {text: 'Please select feedback type', color: TOAST_ERROR})
        return
      }
      if (!this.$store.state.app.loading) {
        this.canSendRequest = false
        setTimeout(() => {
          this.canSendRequest = true
        }, 5000)
        try {
          const brightId = localStorage.getItem('brightId')

          const payload = {
            category: this.selectedFeedbackOption.id,
            text: this.body
          }
          if (this.email) {
            payload.email = this.email
          }

          const encryptedPayload = encryptDataWithPrivateKey(payload)

          this.$store.commit('app/setLoading', true);
          await this.$backendApi.post('/v1/feedback/' + brightId + '/create', {
            encryptedPayload,
          })
          this.$store.commit('toast/addToast', {
            text: 'Message submitted successfully',
            color: TOAST_SUCCESS,
          })
        } catch (error) {
          if (error.message === 'retryRequest') {
            this.handleSendFeedback()
          } else {
            this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
          }
        } finally {
          this.$store.commit('app/setLoading', false);
        }
      }
    },
    visitLink(link) {
      window.open(link, '_blank');
    },
    setSelectedFeedbackOption(item) {
      this.selectedFeedbackOption = item
    },
  }
}
</script>
