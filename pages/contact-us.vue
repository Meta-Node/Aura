<template>
  <section class="contact-us">
    <div class="container contact-us__wrapper">
      <h3 class="contact-us__title">Contact Us</h3>
      <div class="contact-us__body">
        <p class="contact-us__text">
          If you have any questions, feedbacks, bugs, or suggestions, please
          feel free to contact us. fill out the form below and we will get back
          to you as soon as possible.
        </p>
        <AppInput
          placeholder="email (optional)"
          style="margin-bottom: 20px"
        ></AppInput>
        <AppInput
          placeholder="description *"
          type="textarea"
          style="margin-bottom: 20px"
        ></AppInput>
        <AppButton @click.native="handleSendFeedback">Send</AppButton>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'

export default {
  components: {
    AppInput,
    AppButton,
  },
  data() {
    return {}
  },
  methods: {
    handleSendFeedback() {},
  },
}
</script>