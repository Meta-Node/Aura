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
              :max="5"
              :min="-5"
              :prev-value="+profile.previousRating"
              :step="1"
              :value="previousRating"
              type="range"
              @changed="onFeedbackChanged"
            />
          </div>
        </div>
      </div>
      <div style="width: 165px; margin: 20px auto; display: flex">
        <span class="material-symbols-rounded">
          electric_bolt
        </span>
        <energy-slider
          id="quality"
          v-model="energyValue"
          :min="0"
          :user-id="profile ? profile.id : undefined"
          type="range"
          @input="changeEnergy"
        />
      </div>
      <mutual-connections :profile="profile"/>
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
      energyValue: 0,
      isAlreadyRated: false,
      debugError: null,
    }
  },
  computed: {
    previousRating() {
      return +this.profile.previousRating || 0
    },
    img() {
      return this.$route.params.id
    },
    transferedEnergyToProfile() {
      return Number(this.$store.state.energy.transferedEnergy?.find(
        en => en.toBrightId === this.profile?.id
      )?.amount || 0)
    }
  },
  watch: {
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
          this.energyData = this.$store.state.energy.transferedEnergy
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
        await this.updateEnergy()
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
