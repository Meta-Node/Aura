<template>
  <div class="toggle-switch">
    <label :for="generateId" class="toggle-switch__label">
      <input
        :id="generateId"
        class="toggle-switch__checkbox"
        type="checkbox"
        :checked="false"
      />
      <span class="toggle-switch__round"></span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    generateId() {
      return 'switch' + this.id
    },
  },
}
</script>