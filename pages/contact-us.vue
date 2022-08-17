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
        <AppSelectInput
          :options="feedbackOptions"
          :selected-item="selectedFeedbackOption"
          placeholder="-- feedback type * --"
          style="margin-bottom: 20px"
          @handleItemClicked="setSelectedFeedbackOption"
        />
        <AppInput
          placeholder="description *"
          style="margin-bottom: 20px"
          type="textarea"
        ></AppInput>
        <AppButton @click.native="handleSendFeedback">Send</AppButton>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from '@/components/AppInput.vue'
import AppButton from '@/components/AppButton.vue'
import AppSelectInput from '@/components/AppSelectInput.vue'

export default {
  components: {
    AppInput,
    AppButton,
    AppSelectInput,
  },
  data() {
    return {
      selectedFeedbackOption: null,
      feedbackOptions: [
        {
          id: 0,
          title: 'Question'
        },
        {
          id: 1,
          title: 'Suggestion',
        },
        {
          id: 2,
          title: 'Bug',
        },
        {
          id: 3,
          title: 'Other',
        },
      ],
    }
  },
  methods: {
    setSelectedFeedbackOption(item) {
      this.selectedFeedbackOption = item
    },
  },
}
</script>
