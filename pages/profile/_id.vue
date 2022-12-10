<template>
  <div data-route="profile">
    <section class="profile app-page">
      <div
        v-if="isLoadingInitialData"
        style="margin-top: 40px"
      >
        <app-spinner :is-visible="true"/>
      </div>
      <div
        v-else
        class="container"
      >
        <profile-info
          :id="brightId"
          :brightness="brightness"
          :connection-date="profile.connectionDate"
          :date="getDate"
          :img="profileAvatar"
          :is-own-profile="isOwn"
          :name="profile.name"
          :nickname="profile.nickname"
          :num-of-connections="profile.numOfConnections"
          :rating="Number(profile.rating)"
          @edit="onEdit"
          @share="onShare"
        />
        <aura-statistics
          :profile-inbound-energy="profileInboundEnergy"
          :profile-incoming-ratings="profileIncomingRatings"
          :profile-rated-users="profileRatedUsers"
          :profile-transferred-energy="profileTransferredEnergy"
          :stat="stat"
        />
        <stats
          v-if="stat"
          :is-own="isOwn"
          :loading-profile-data="loadingProfileData"
          :profile="profile"
          :profile-inbound-energy="profileInboundEnergy"
          :profile-incoming-connections="profileIncomingConnections"
          :profile-incoming-ratings="profileIncomingRatings"
          :profile-rated-users="profileRatedUsers"
          :profile-transferred-energy="profileTransferredEnergy"
          :stat="stat"/>
        <others-profile
          v-else
          ref="private"
          :brightness="brightness"
          :date="getDate"
          :four-unrated="fourUnrated"
          :is-loading-initial-data="isLoadingInitialData"
          :loading-profile-data="loadingProfileData"
          :profile="profile"
          :profile-inbound-energy="profileInboundEnergy"
          :profile-incoming-connections="profileIncomingConnections"
          :profile-incoming-ratings="profileIncomingRatings"
          :profile-outbound-connections="profileOutboundConnections"
          :profile-rated-users="profileRatedUsers"
          :profile-transferred-energy="profileTransferredEnergy"
          @afterSave="onAfterSave"
          @share="onShare"
          @updateNickname="updateNickname"
        />
      </div>
      <nickname-popup
        v-if="profile && profile.id"
        ref="popup"
        :to-bright-id="profile.id"
        @updateNickname="updateNickname"
      />
    </section>
  </div>
</template>

<script>
import transition from '~/mixins/transition'
import OthersProfile from '~/components/profile/OthersProfile.vue'
import {
  getConnection,
  getIncomingConnections,
  getOutboundConnections,
  getProfile
} from '~/scripts/api/connections.service'
import {IS_PRODUCTION, RATING_INBOUND_STAT, TOAST_ERROR} from "~/utils/constants";
import {toRoundedPercentage} from "~/utils/numbers";
import unsavedChanges from "~/mixins/unsavedChanges";
import {getIncomingRatings, getRatedUsers} from "~/scripts/api/rate.service";
import {getEnergy, getInboundEnergy} from "~/scripts/api/energy.service";
import avatar from "~/mixins/avatar";
import NicknamePopup from "~/components/popup/NicknamePopup";
import AuraStatistics from "~/components/profile/AuraStatistics";
import Stats from "~/components/profile/Stats";

export default {
  components: {
    Stats,
    AuraStatistics,
    NicknamePopup,
    OthersProfile,
  },
  mixins: [transition, unsavedChanges, avatar],

  data() {
    return {
      profile: {},
      isLoadingInitialData: true,

      loadingProfileData: true,
      profileIncomingConnections: null,
      profileInboundEnergy: null,
      profileTransferredEnergy: null,
      profileRatedUsers: null,
      profileIncomingRatings: null,
      profileOutboundConnections: null,
    }
  },

  head() {
    return {
      title: `Aura | ${this.profile?.name || this.profile?.id || 'Unknown'}`,
    }
  },

  computed: {
    isOwn() {
      return process.client && this.brightId === localStorage.getItem('brightId')
    },
    stat() {
      return this.$route.query.stat || (this.isOwn ? RATING_INBOUND_STAT : '')
    },
    img() {
      return this.brightId
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

  async mounted() {
    this.isLoadingInitialData = true

    if (!this.brightId) {
      this.$router.replace('/profile/' + localStorage.getItem('brightId'))
      return
    }

    this.getProfileData()

    if (this.isOwn) {
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
    onEdit() {
      this.$refs.popup.openPopup()
    },
    getProfileData() {
      if (this.brightId === localStorage.getItem('brightId')) {
        Promise.all([
          this.$store.dispatch('profile/loadProfileData'),
          this.$store.dispatch('profile/getIncomingRatings'),
          this.$store.dispatch('energy/getTransferredEnergy'),
          this.$store.dispatch('energy/getInboundEnergy'),
          getIncomingConnections(this.$brightIdNodeApi, this.brightId),
          getOutboundConnections(this.$brightIdNodeApi, this.brightId),
        ]).then(([_r1, _r2, _r3, _r4, inboundConnections, outboundConnections]) => {
          this.profileIncomingRatings = this.$store.getters["profile/incomingRatings"];
          this.profileRatedUsers = this.$store.getters["profile/ratedUsers"];
          this.profileInboundEnergy = this.$store.getters["energy/inboundEnergy"];
          this.profileTransferredEnergy = this.$store.getters["energy/outboundEnergy"].filter(e => e.amount > 0);
          this.profileIncomingConnections = inboundConnections;
          this.profileOutboundConnections = outboundConnections;
          this.loadingProfileData = false;
        }).catch(error => {
          if (!IS_PRODUCTION) {
            console.log('getProfileError\n' + (error?.response?.data || error))
            alert('getProfileError\n' + (error?.response?.data || error))
          }
          console.log(error)
        })
      } else {
        Promise.all([
          getIncomingRatings(this.$backendApi, this.brightId),
          getRatedUsers(this.$backendApi, this.brightId),
          getInboundEnergy(this.$backendApi, this.brightId),
          getEnergy(this.$backendApi, this.brightId),
          getIncomingConnections(this.$brightIdNodeApi, this.brightId),
          getOutboundConnections(this.$brightIdNodeApi, this.brightId),
        ]).then(([inboundRatings, outboundRatings, inboundEnergy, outboundEnergy, inboundConnections, outboundConnections]) => {
          this.profileIncomingRatings = inboundRatings;
          this.profileRatedUsers = outboundRatings;
          this.profileInboundEnergy = inboundEnergy;
          this.profileTransferredEnergy = outboundEnergy;
          this.profileIncomingConnections = inboundConnections;
          this.profileOutboundConnections = outboundConnections;
          this.loadingProfileData = false;
        }).catch(error => {
          if (!IS_PRODUCTION) {
            console.log('getProfileError\n' + (error?.response?.data || error))
            alert('getProfileError\n' + (error?.response?.data || error))
          }
          console.log(error)
        })
      }
    },
    onAfterSave() {
      if (this.$store.getters["app/isFirstVisitedRoute"]) {
        this.$router.push('/connections/')
      } else {
        this.$router.go(-1)
      }
    },
    async loadConnectionProfile() {
      try {
        !this.isOwn &&
        (await this.$store.dispatch('connections/getConnectionsData'))
        await this.$store.dispatch('profile/loadProfileData')
        await this.$store.dispatch('energy/getTransferredEnergy')
        const connections = this.$store.getters['profile/connections']

        const profile = connections.find(con => con.id === this.brightId)

        const res = await getProfile(this.$backendApi, this.brightId, this.isOwn)

        const transferredEnergy = this.$store.state.energy.transferredEnergy
        const outboundEnergyObject = transferredEnergy.find(
          en => en.toBrightId === this.brightId
        )

        this.profile = {
          ...profile, ...res.data,
          transferredEnergyPercentage: outboundEnergyObject
            ? toRoundedPercentage(
              outboundEnergyObject.amount,
              outboundEnergyObject.scale
            )
            : 0,
          transferredEnergy: outboundEnergyObject?.amount || 0
        }
        if (profile) {
          const connectionRes = await getConnection(this.$backendApi, this.brightId)
          if (connectionRes?.previousRating) {
            this.profile.previousRating = connectionRes.previousRating.rating
          }
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
      const URL = location.href

      copyToClipboard(URL)
      this.$store.commit('toast/addToast', {
        text: 'Link was coppied to your clipboard',
        color: 'primary',
      })
    },
  },
}
</script>
