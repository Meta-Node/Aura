<template>
  <div class="input-wrapper">
    <input
      :id="id"
      class="input form__input"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      data-validation="required"
    />
    <div v-if="isSearch" class="search-input">
      <svg
        width="15.6"
        height="15.6"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
          stroke="#F1F1F199"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
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
    isSearch: {
      type: Boolean,
      default: false,
    },
  },
}
</script>