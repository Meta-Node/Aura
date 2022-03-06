<template>
  <div class="app-flow">
    <div class="energy__input-wrapper">
      <app-input
        id="search"
        :is-search="true"
        class="input-wrapper"
        type="text"
        placeholder="Search..."
        :required="true"
      />
    </div>
    <div class="energy__statistic">
      <div class="energy__stat-filter">
        <button class="energy__stat-button">Inbound</button>
        <button class="energy__stat-button">Outbound</button>
      </div>
      <div class="energy__switch-wrapper">
        <div class="energy__switch-button">
          <button class="energy__button">Name V</button>
        </div>
        <div class="energy__switch-button">
          <button class="energy__button">Amount V</button>
        </div>
      </div>
      <div class="energy__humans-stat">
        <ul class="energy__humans">
          <user-v-2
            v-for="(user, idx) in 10"
            :key="idx"
            img="/images/card-img.jpg"
            name="User Name"
            url="/"
            inbound="190.7%"
            outbound="148.6%"
          />
        </ul>
      </div>
      <div class="btn__wrapper">
        <button class="text-button energy__btn">Load More...</button>
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from '~/components/AppInput.vue'
import UserV2 from '~/components/UserV2.vue'
export default {
  components: { UserV2, AppInput },
}
</script>