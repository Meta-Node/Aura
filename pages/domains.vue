<template>
  <section class="app-page">
    <div class="container">
      <h3 class="domains__title">Domains</h3>
      <div class="domains__body">
        <div v-for="domain in DOMAINS" :key="domain.id" class="domains__domain" @click="setActiveDomainId(domain.id)">
          <div class="domains__domain__header__container">
            <h4>{{ domain.name }}</h4>
            <div
              style="width: 40px; height: 40px; border-radius: 50%; padding: 6px; margin-left: 6px;">
              <nuxt-img
                :alt="domain.name"
                :src="domain.logo"
              />
            </div>
          </div>
          {{ domain.description }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {DOMAINS} from "~/utils/constants";

export default {
  data() {
    return {
      DOMAINS
    }
  },
  computed: {
    loading() {
      return this.$store.state.app.loading
    }
  },
  methods: {
    setActiveDomainId(domainId) {
      this.$store.commit('app/setActiveDomainId', domainId)
      this.$router.push('/connections/')
    }
  }
}
</script>
