<template>
  <div class="input-wrapper form__input-wrapper">
    <input
      :id="id"
      class="input form__input"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      data-validation="required"
    />
    <label :for="id" class="label form__label"></label>
    <!-- <small class="form__input-error">Error</small> -->
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: 'text',
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
}
</script>