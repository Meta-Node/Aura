<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <div class="explorer__input-wrapper">
        <app-search @searchValue="onSearchValue" />
      </div>
      <div class="explorer__indicator">
        <h3 class="explorer__indicator-text">Your energy</h3>
        <div class="explorer__indicator-wrapper">
          <div class="explorer__indicator-line"></div>
        </div>
        <div class="explorer__indicator-percents">60%</div>
      </div>
      <switch-page :users="users" />
    </div>
  </section>
</template>

<script>
import AppSearch from '~/components/AppSearch.vue'
import SwitchPage from '~/components/SwitchPage.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'

export default {
  components: { AppSearch, SwitchPage },
  mixins: [transition, users],

  data() {
    return {
      isExplorer: true,
    }
  },
  methods: {
    onFlowClick() {
      this.isExplorer = true
    },
    onOverviewClick() {
      this.isExplorer = false
    },
  },
}
</script>