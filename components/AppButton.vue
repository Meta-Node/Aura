<template>
  <button :data-testid="dataTestid" class="btn">
    <slot/>
  </button>
</template>

<script>
export default {
  props: {
    dataTestid: {
      type: String,
    }
  }
}
</script>
