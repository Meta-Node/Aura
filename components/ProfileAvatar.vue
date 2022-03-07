<template>
  <div class="profile__card-img">
    <img class="img profile__avatar" :src="img" :alt="name" />
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      default: '/',
    },
  },
}
</script>