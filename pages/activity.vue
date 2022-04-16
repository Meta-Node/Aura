<template>
  <section class="activity">
    <div class="container activity__wrapper">
      <h3 class="activity__title">Activity</h3>
      <div class="activity-switch">
        <div class="switch__wrapper">
          <button
            class="switch__filter-button"
            :class="[isPersonal && 'switch__filter-button--active']"
            @click="onPersonalClick"
          >
            Personal
          </button>
          <button
            class="switch__filter-button"
            :class="[!isPersonal && 'switch__filter-button--active']"
            @click="onGlobalClick"
          >
            Global
          </button>
        </div>
        <div class="enegry__screens">
          <transition name="fade" mode="out-in">
            <personal-activity v-if="isPersonal" />
            <global-activity v-else />
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import GlobalActivity from '~/components/activity/GlobalActivity.vue'
import PersonalActivity from '~/components/activity/PersonalActivity.vue'

export default {
  components: { PersonalActivity, GlobalActivity },
  data() {
    return {
      isPersonal: true,
    }
  },
  mounted() {
    if (this.$route.query.tab) {
      this.$route.query.tab === 'Personal'
        ? this.onPersonalClick()
        : this.onGlobalClick()
    }
  },
  methods: {
    onPersonalClick() {
      this.isPersonal = true
      this.$router.push({ query: { tab: 'Personal' } })
    },
    onGlobalClick() {
      this.isPersonal = false
      this.$router.push({ query: { tab: 'Global' } })
    },
  },
}
</script>