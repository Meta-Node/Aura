<template>
  <div class="toggle-switch">
    <label :for="generateId" class="toggle-switch__label">
      <input
        :id="generateId"
        class="toggle-switch__checkbox"
        type="checkbox"
        :checked="isChecked"
        @change="onChange"
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
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isChecked: false,
    }
  },
  computed: {
    generateId() {
      return 'switch' + this.id
    },
  },
  mounted() {
    this.isChecked = this.isActive
  },
  methods: {
    onChange() {
      this.isChecked = !this.isChecked
      this.$emit('toggle', this.isChecked)
    },
  },
}
</script>