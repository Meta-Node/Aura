<template>
  <div class="popup" :class="[isOpen && 'popup--open']">
    <div class="popup__backdrop" @click="closePopup"></div>
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
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      this.isOpen = true
    },
    closePopup() {
      document.documentElement.style.overflow = 'auto'
      document.body.style.overflow = 'auto'

      this.isOpen = false
    },
  },
}
</script>