<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <div class="explorer__input-wrapper">
        <app-search @searchValue="onSearchValue" />
      </div>
      <energy-indicator :percent="40" />
      <switch-page :users="users" />
    </div>
  </section>
</template>

<script>
import AppSearch from '~/components/AppSearch.vue'
import SwitchPage from '~/components/SwitchPage.vue'
import EnergyIndicator from '~/components/EnergyIndicator.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'

export default {
  components: { AppSearch, SwitchPage, EnergyIndicator },
  mixins: [transition, users],
}
</script>