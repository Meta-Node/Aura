<template>
  <div data-route="profile">
    <private-profile
      v-if="isPrivate"
      ref="private"
      :brightness="brightness"
      :date="getDate"
      :four-unrated="fourUnrated"
      :is-loading-initial-data="isLoadingInitialData"
      :profile="profile"
      :profile-inbound-energy="profileInboundEnergy"
      :profile-transferred-energy="profileTransferredEnergy"
      :profile-rated-users="profileRatedUsers"
      :profile-incoming-ratings="profileIncomingRatings"
      :loading-profile-data="loadingProfileData"
      :profile-incoming-connections="profileIncomingConnections"
      @afterSave="onAfterSave"
      @share="onShare"
      @updateNickname="updateNickname"
    />
    <public-profile
      v-if="!isPrivate"
      ref="public"
      :brightness="brightness"
      :date="getDate"
      :four-unrated="fourUnrated"
      :is-loading-initial-data="isLoadingInitialData"
      :profile="profile"
      :profile-inbound-energy="profileInboundEnergy"
      :profile-transferred-energy="profileTransferredEnergy"
      :profile-rated-users="profileRatedUsers"
      :profile-incoming-ratings="profileIncomingRatings"
      :loading-profile-data="loadingProfileData"
      :profile-incoming-connections="profileIncomingConnections"
      @share="onShare"
    />
    <nuxt-link
      v-if="!isAuth && isPublicRouteQuery"
      class="profile__login-cta"
      to="/"
    >
      Please, login in Aura app to see more
    </nuxt-link>
  </div>
</template>

<script>
import transition from '~/mixins/transition'
import PrivateProfile from '~/components/profile/PrivateProfile.vue'
import PublicProfile from '~/components/profile/PublicProfile.vue'
import {getConnection, getIncomingConnections, getProfile} from '~/scripts/api/connections.service'
import {TOAST_ERROR} from "~/utils/constants";
import {toRoundedPercentage} from "~/utils/numbers";
import unsavedChanges from "~/mixins/unsavedChanges";
import {getIncomingRatings, getRatedUsers} from "~/scripts/api/rate.service";
import {getEnergy, getInboundEnergy} from "~/scripts/api/energy.service";

export default {
  components: {
    PrivateProfile,
    PublicProfile,
  },
  mixins: [transition, unsavedChanges],

  beforeRouteEnter(_to, from, next) {
    next(vm => {
      vm.fromRoute = from
    })
  },

  data() {
    return {
      isPrivate: true,
      isOwn: false,
      profile: {},
      isLoadingInitialData: true,

      profileCallsDone: 0,
      profileIncomingConnections: [],
      profileInboundEnergy: [],
      profileTransferredEnergy: [],
      profileRatedUsers: [],
      profileIncomingRatings: [],
    }
  },

  head() {
    return {
      title: `Aura | ${this.profile?.name || this.profile?.id || 'Unknown'}`,
    }
  },

  computed: {
    loadingProfileData() {
      return this.profileCallsDone < 5
    },
    brightness() {
      return this.profile?.rating / 10
    },
    fourUnrated() {
      return this.$store.getters['profile/fourUnrated']
    },
    brightId() {
      return this.$route.params.id
    },
    isPublicRouteQuery() {
      return this.$route.query?.account === 'public'
    },
    getDate() {
      const difDate = {}
      const today = new Date()
      if (!this.profile?.brightIdDate) {
        return
      }
      const reg = new Date(this.profile.brightIdDate)

      const todayDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      }

      const regDate = {
        year: reg.getFullYear(),
        month: reg.getMonth() + 1,
        day: reg.getDate(),
      }

      Object.keys(todayDate).forEach(key => {
        difDate[key] = todayDate[key] - regDate[key]
      })

      if (difDate.year >= 1) {
        return difDate.year + ' year(s)'
      }

      if (difDate.year < 1 && difDate.month >= 1) {
        return difDate.month + ' month(s)'
      }

      return '< 1 month'
    },
    isAuth() {
      return this.$store.state.app.isAuth
    },
  },

  watch: {
    isPrivate() {
      const accType = this.isPrivate ? 'private' : 'public'
      this.$router.replace({query: {account: accType}})
    },
  },

  async mounted() {
    this.isLoadingInitialData = true

    if (!this.brightId) {
      this.$router.replace('/profile/' + localStorage.getItem('brightId'))
      return
    }

    this.getProfileData()

    if (this.brightId === localStorage.getItem('brightId')) {
      this.isPrivate = false
      this.isOwn = true
      await this.loadOwnProfile()
      return
    }

    await this.loadConnectionProfile()
  },
  beforeDestroy() {
    const queries = this.$route.query
    if (queries.account) {
      delete queries.account
    }
    this.$router.push({query: {...queries}})
  },
  methods: {
    getProfileData() {
      const onDone = () => {
        this.profileCallsDone++;
      }
      const onError = error => {
        this.$store.commit('toast/addToast', {text: 'Error while retrieving profile', color: TOAST_ERROR})
        console.log(error)
      }
      if (this.brightId === localStorage.getItem('brightId')) {
        this.$store.dispatch('profile/loadProfileData').then(() => {
          this.profileRatedUsers = this.$store.getters["profile/ratedUsers"];
          onDone()
        }).catch(onError)
        this.$store.dispatch('profile/getIncomingRatings').then(() => {
          this.profileIncomingRatings = this.$store.getters["profile/incomingRatings"];
          onDone()
        }).catch(onError)
        this.$store.dispatch('energy/getTransferredEnergy').then(() => {
          this.profileTransferredEnergy = this.$store.getters["energy/transferredEnergy"];
          onDone()
        }).catch(onError)
        this.$store.dispatch('energy/getInboundEnergy').then(() => {
          this.profileInboundEnergy = this.$store.getters["energy/inboundEnergy"];
          onDone()
        }).catch(onError)
      } else {
        getIncomingRatings(this.$backendApi, this.brightId).then(ratings => {
          this.profileIncomingRatings = ratings;
          onDone()
        }).catch(onError)
        getRatedUsers(this.$backendApi, this.brightId).then(ratings => {
          this.profileRatedUsers = ratings;
          onDone()
        }).catch(onError)
        getEnergy(this.$backendApi, this.brightId).then(energy => {
          this.profileTransferredEnergy = energy;
          onDone()
        }).catch(onError)
        getInboundEnergy(this.$backendApi, this.brightId).then(energy => {
          this.profileInboundEnergy = energy;
          onDone()
        }).catch(onError)
      }
      getIncomingConnections(this.$brightIdNodeApi, this.brightId).then(connections => {
        console.log({connections})
        this.profileIncomingConnections = connections
        onDone()
      }).catch(onError)
    },
    onAfterSave() {
      if (this.fromRoute?.name) {
        this.$router.go(-1)
      } else {
        this.$router.push('/connections/')
      }
    },
    async loadConnectionProfile() {
      try {
        !this.isPublicRouteQuery &&
        (await this.$store.dispatch('connections/getConnectionsData'))
        await this.$store.dispatch('profile/loadProfileData')
        await this.$store.dispatch('energy/getTransferredEnergy')
        const connections = this.$store.getters['profile/connections']

        this.profile = connections.find(con => con.id === this.brightId)

        const res = await getProfile(this.$backendApi, this.brightId, this.isPublicRouteQuery)

        const transferredEnergy = this.$store.state.energy.transferredEnergy
        const outboundEnergyObject = transferredEnergy.find(
          en => en.toBrightId === this.brightId
        )

        this.profile = {
          ...this.profile, ...res.data,
          transferredEnergyPercentage: outboundEnergyObject
            ? toRoundedPercentage(
              outboundEnergyObject.amount,
              outboundEnergyObject.scale
            )
            : 0,
          transferredEnergy: outboundEnergyObject?.amount || 0
        }
        const connectionRes = await getConnection(this.$backendApi, this.brightId)
        this.isPrivate = !this.isPublicRouteQuery
        if (connectionRes?.previousRating) {
          this.profile.previousRating = connectionRes.previousRating.rating
        }
        this.isLoadingInitialData = false
      } catch (error) {
        console.log(error)
        this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
      }
    },
    async loadOwnProfile() {
      try {
        await this.$store.dispatch('profile/loadProfileData')

        this.profile = this.$store.getters['profile/profileData']
        this.isLoadingInitialData = false
      } catch (error) {
        console.log(error)
        this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
      }
    },

    updateNickname(value) {
      this.profile.nickname = value
    },

    async onShare() {
      const {copyToClipboard} = await import(
        '~/scripts/utils/copyToClipboard'
        )
      const URL = this.isPublicRouteQuery
        ? location.href
        : location.href + '?account=public'

      copyToClipboard(URL)
      this.$store.commit('toast/addToast', {
        text: 'Link was coppied to your clipboard',
        color: 'primary',
      })
    },
  },
}
</script>
