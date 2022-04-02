<template>
  <div class="toggle-switch">
    <label :for="generateId" class="toggle-switch__label">
      <input :id="generateId" class="toggle-switch__checkbox" type="checkbox" />
      <span class="toggle-switch__round"></span>
    </label>
  </div>
</template>

<script>
export default {
  methods: {
    generateId () {
      return 'switch' + Date.now()
    }
  }
}
</script>