<template>
  <div class="popup" :class="[isOpen && 'popup--open']">
    <div class="popup__backdrop"></div>
    <div class="popup__window">
      <button class="popup__close" @click="closePopup">
        <span class="popup__close-line"></span>
        <span class="popup__close-line"></span>
      </button>
      <slot> </slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isOpen: false,
    }
  },
  methods: {
    openPopup() {
      this.isOpen = true
    },
    closePopup() {
      this.isOpen = false
    },
  },
}
</script>