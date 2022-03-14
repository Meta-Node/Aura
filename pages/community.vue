<template>
  <section class="community">
    <div class="container community__wrapper">
      <div class="community__search">
        <h3 class="community__search-title">Find A Connection</h3>
        <app-input
          id="search"
          class="community__input-wrapper"
          type="text"
          placeholder="Search..."
          :required="true"
          :is-search="true"
        />
      </div>
      <div class="community__users">
        <h3 class="community__humans-title">Your Connections</h3>
        <div class="switch-wrapper">
          <filter-button name="Name" :active="true" />
          <filter-button name="Rating" />
          <filter-button name="Unrated" :is-icon="false" />
        </div>
        <ul class="community__humans">
          <user-v-1
            v-for="(user, idx) in 10"
            :key="idx"
            :is-brightness="true"
            :brightness="Math.round(20 * Math.random())"
            img="/images/card-img.jpg"
            name="User Name"
            url="/"
          />
        </ul>
        <div class="btn__wrapper">
          <button class="text-button community__btn">Load More...</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from '~/components/AppInput.vue'
import UserV1 from '~/components/UserV1.vue'
import FilterButton from '~/components/FilterButton.vue'
import transition from '~/mixins/transition'
export default {
  components: { AppInput, UserV1, FilterButton },
  mixins: [transition],
}
</script>