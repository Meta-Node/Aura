<template>
  <section class="feedback">
    <div v-if="debugError" class="debug-error">debug error: {{ debugError }}</div>
    <div
      v-if="isLoading"
      style="margin-top: 40px"
    >
      <app-spinner :is-visible="true"/>
    </div>
    <div
      v-else-if="!isLoading && !profile.name"
      class="container"
    >
      <p style="margin: 0 auto; text-align: center">User not found</p>
    </div>
    <div
      v-else
      class="container feedback__wrapper"
    >
      <profile-info
        :id="profile.id"
        :brightness="brightness"
        :connection-date="profile.connectionDate"
        :date="date"
        :img="profileAvatar"
        :name="profile.name"
        :nickname="profile.nickname"
        :num-of-connections="profile.numOfConnections"
        :rating="Number(profile.rating)"
        @edit="onEdit"
        @share="onShare"
      />
      <aura-statistics :user-id="profile.id"/>
      <div class="feedback__questions">
        <div class="feedback__quality-wrapper">
          <div class="feedback__transition">
            <feedback-slider
              id="quality"
              v-model="ratingValue"
              :max="5"
              :min="-5"
              :prev-value="+profile.previousRating"
              :step="1"
              type="range"
              @submit="onFeedbackChanged"
            />
          </div>
        </div>
      </div>
      <div class="feedback__energy__wrapper">
        <div v-if="showEnergySlider" class="feedback__energy__container">
          <div class="feedback__energy__label__wrapper">
            <span class="material-symbols-rounded">
              electric_bolt
            </span>
            <span class="feedback__energy__label__text"
            >Energy</span>
          </div>
          <energy-slider
            id="quality"
            v-model="energyValue"
            :disabled="ratingValue < 1"
            :min="0"
            :user-id="profile ? profile.id : undefined"
            type="range"
            @input="changeEnergy"
          />
        </div>
        <button v-else
                class="feedback__energy__energize-button"
                @click="energize = true">
            <span class="material-symbols-rounded">
              electric_bolt
            </span><span>energize</span>
        </button>
      </div>
      <mutual-connections
        :profile="profile" :safe-navigate-to="safeNavigateTo"/>
    </div>
    <nickname-popup
      v-if="profile && profile.id"
      ref="popup"
      :to-bright-id="profile.id"
      @updateNickname="updateNickname"
    />
  </section>
</template>

<script>
import MutualConnections from './MutualConnections'
import AppSpinner from '~/components/AppSpinner.vue'

import FeedbackSlider from '~/components/FeedbackSlider.vue'
import NicknamePopup from '~/components/popup/NicknamePopup.vue'
import ProfileInfo from '~/components/ProfileInfo.vue'
import {rateUser} from '~/scripts/api/rate.service'
import transition from '~/mixins/transition'
import avatar from '~/mixins/avatar'
import {IS_PRODUCTION, TOAST_ERROR, TOAST_SUCCESS} from "~/utils/constants";
import AuraStatistics from "~/components/profile/AuraStatistics";
import energySet from "~/mixins/energySet";
import {deepCopy} from "~/utils";

export default {
  components: {
    AuraStatistics,
    FeedbackSlider,
    ProfileInfo,
    AppSpinner,
    NicknamePopup,
    MutualConnections,
  },
  mixins: [transition, avatar, energySet],
  props: {
    profile: {
      type: Object,
      default: () => {
      },
    },
    connections: {
      type: Object,
      default: () => {
      },
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
      default: '',
    },
    safeNavigateTo: {
      type: Function,
    },
    brightness: {
      type: Number,
      default: 0,
    },
    fourUnrated: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      energize: false,
      ratingValue: 0,
      energyValue: 0,
      isAlreadyRated: false,
      debugError: null,
    }
  },
  computed: {
    showEnergySlider() {
      return this.prevTransferedEnergyToProfile > 0 || this.energize
    },
    previousRating() {
      return +this.profile.previousRating || 0
    },
    img() {
      return this.$route.params.id
    },
    prevTransferedEnergyToProfile() {
      return Number(this.$store.state.energy.prevTransferedEnergy?.find(
        en => en.toBrightId === this.profile?.id
      )?.amount || 0)
    },
    transferedEnergyToProfile() {
      return Number(this.$store.state.energy.transferedEnergy?.find(
        en => en.toBrightId === this.profile?.id
      )?.amount || 0)
    }
  },
  watch: {
    ratingValue: {
      immediate: true,
      handler(value, oldValue) {
        if (value < 1) {
          this.changeEnergy(0)
        } else if (oldValue < 1) {
          this.changeEnergy(this.prevTransferedEnergyToProfile)
        }
      }
    },
    transferedEnergyToProfile: {
      immediate: true,
      handler(newValue, _oldValue) {
        this.energyValue = Number(newValue);
      }
    },
    isLoading: {
      immediate: true,
      handler(newValue, _oldValue) {
        if (!newValue) {
          this.energyData = deepCopy(this.$store.state.energy.prevTransferedEnergy)
          this.ratingValue = this.previousRating
        }
      }
    }
  },

  methods: {
    async onFeedbackChanged(rating) {
      this.$store.commit('app/setLoading', true)
      try {
        if (rating !== this.previousRating) {
          await rateUser(this.$backendApi, {
            rating,
            fromBrightId: localStorage.getItem('brightId'),
            toBrightId: this.profile.id,
          })
          this.$store.commit('toast/addToast', {
            text: 'Rating Successfully updated',
            color: TOAST_SUCCESS,
          })
        }
        if (rating >= 1 && this.prevTransferedEnergyToProfile !== this.transferedEnergyToProfile) {
          await this.updateEnergy()
        } else {
          this.$store.commit('app/setLoading', false)
        }
        this.$router.push('/connections')
      } catch (error) {
        this.$store.commit('app/setLoading', false)
        if (!IS_PRODUCTION) {
          this.debugError = JSON.stringify(error.response?.data)
        }
        if (error.message === 'retryRequest') {
          this.onFeedbackChanged(rating)
        } else {
          this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
        }
      }
    },
    onShare() {
      this.$emit('share')
    },
    onEdit() {
      this.$refs.popup.openPopup()
    },
    updateNickname(value) {
      this.$emit('updateNickname', value)
    },
    changeEnergy(value) {
      this.onChangeEnergy({amount: Number(value), toBrightId: this.profile.id})
    }
  },
}
</script>
