<template>
  <li class="result__data-list">
    <div class="result__circle"></div>
    <p class="result__tag">{{ name }}</p>
    <p class="result__num result__num-name">{{ dataName }}</p>
    <p class="result__num result__num-abound">{{ dataAbound }}</p>
  </li>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Name',
    },
    dataName: {
      type: String,
      default: '',
    },
    dataAbound: {
      type: String,
      default: '',
    },
  },
}
</script>