<template>
  <div class="app-flow">
    <div class="flow__input-wrapper">
      <app-input
        id="search"
        :is-search="true"
        class="input-wrapper"
        type="text"
        placeholder="Search..."
        :required="true"
      />
    </div>
    <div class="flow__statistic">
      <div class="flow__stat-filter">
        <button class="flow__stat-button">Inbound</button>
        <button class="flow__stat-button">Outbound</button>
      </div>
      <div class="flow__switch-wrapper">
        <filter-button name="Name V" />
        <filter-button name="Amount V" />
      </div>
      <div class="flow__humans-stat">
        <ul class="flow__humans">
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
        <button class="text-button flow__btn">Load More...</button>
      </div>
    </div>
  </div>
</template>

<script>
import AppInput from '~/components/AppInput.vue'
import UserV2 from '~/components/UserV2.vue'
import FilterButton from '~/components/FilterButton.vue'
export default {
  components: { UserV2, AppInput, FilterButton },
}
</script>