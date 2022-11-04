<template>
  <div class="four-unrated">
    <h3 class="four-unrated__title">
      <span class="four-unrated__title__text">Yet To Be Rated</span>
      <svg
        id="Layer_1"
        class="four-unrated__title__refresh"
        viewBox="0 0 512 512"
        x="0px"
        xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        y="0px"
        @click="refresh"
      >
        <path
          d="M69.816,256H0l93.096,93.096L186.2,256h-69.816c0.224-77.016,62.6-139.4,139.616-139.632
	c22.672,0.432,44.952,6,65.16,16.296l34.896-34.896C325.6,80.144,291.176,70.528,256,69.832
	C153.296,70.112,70.104,153.296,69.816,256z M395.616,256c-0.224,77.016-62.6,139.4-139.616,139.632
	c-22.672-0.432-44.952-6-65.16-16.296l-34.896,34.896c30.456,17.624,64.88,27.24,100.056,27.936
	C358.696,441.872,441.88,358.696,442.184,256H512l-93.096-93.096L325.8,256H395.616z"
          style="fill: white"
        />
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
        <g></g>
      </svg>
    </h3>

    <app-spinner
      v-if="isLoading"
      ref="indicator"
      :is-visible="true"
      classes="load-more"
    />
    <ul v-else-if="users && users.length" class="user-v1-ul">
      <user-v-1
        v-for="user in users"
        :id="user.id"
        :key="user.id"
        :img="user.id"
        :name="user.nickname || user.name"
        :url="`/profile/${user.id}`"
      />
    </ul>
    <div v-else style="margin-top: 20px; text-align: center">
      You don't have unrated connections
    </div>
  </div>
</template>

<script>
import UserV1 from '~/components/users/UserV1.vue'

export default {
  components: {UserV1},
  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    refresh() {
      this.isLoading = true
      this.$store.dispatch('profile/loadProfileData').finally(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
