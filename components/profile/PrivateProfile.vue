<template>
  <section class="feedback">
    <div v-if="debugError" class="debug-error">debug error: {{ debugError }}</div>
    <div
      v-if="isLoadingInitialData"
      style="margin-top: 40px"
    >
      <app-spinner :is-visible="true"/>
    </div>
    <div
      v-else-if="!isLoadingInitialData && !profile.name"
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
            />
          </div>
        </div>
      </div>
      <div class="feedback__energy__wrapper">
        <div v-if="showEnergySlider" class="feedback__energy__container">
          <div class="feedback__energy__label__wrapper" @click="onEnergyClick">
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
      <div class="feedback__save">
        <button class="feedback__save__button" data-testid="feedback-quality-confirm" @click="onFeedbackChanged">
          save changes
        </button>
      </div>
      <mutual-connections
        :profile="profile"/>
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
import unsavedChanges from "~/mixins/unsavedChanges";

export default {
  components: {
    AuraStatistics,
    FeedbackSlider,
    ProfileInfo,
    AppSpinner,
    NicknamePopup,
    MutualConnections,
  },
  mixins: [transition, avatar, energySet, unsavedChanges],
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
    isLoadingInitialData: {
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
      energize: false,
      ratingValue: 0,
      energyValue: 0,
      isAlreadyRated: false,
      debugError: null,
    }
  },
  computed: {
    showEnergySlider() {
      return this.energyValue > 0 || this.energize
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
    },
    hasUnsavedChangesLocal() {
      if (this.isLoadingInitialData) return false;
      if (this.unsavedChangedEnergies?.length) return true;
      if (this.ratingValue !== this.previousRating) return true;
      return false
    }
  },
  watch: {
    hasUnsavedChangesLocal: {
      immediate: true,
      handler(value) {
        this.hasUnsavedChanges = value
      }
    },
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
    isLoadingInitialData: {
      immediate: true,
      handler(newValue, _oldValue) {
        if (!newValue) {
          this.energyData = deepCopy(this.$store.state.energy.prevTransferedEnergy)
          this.ratingValue = this.previousRating
          this.energize = this.transferedEnergyToProfile > 0;
        }
      }
    }
  },

  methods: {
    onEnergyClick() {
      console.log({e: this.energyValue})
      if (this.energyValue === 0) {
        this.energize = false;
      }
    },
    async onFeedbackChanged() {
      this.$store.commit('app/setLoading', true)
      try {
        if (this.ratingValue !== this.previousRating) {
          await rateUser(this.$backendApi, {
            rating: this.ratingValue,
            fromBrightId: localStorage.getItem('brightId'),
            toBrightId: this.profile.id,
          })
        }
        if (this.ratingValue >= 1 && this.prevTransferedEnergyToProfile !== this.transferedEnergyToProfile) {
          await this.updateEnergy(false)
        } else {
          this.$store.commit('app/setLoading', false)
        }
        this.$store.commit('toast/addToast', {
          text: 'Success',
          color: TOAST_SUCCESS,
        })
        this.hasUnsavedChanges = false;
        this.$router.push('/connections')
      } catch (error) {
        this.$store.commit('app/setLoading', false)
        if (!IS_PRODUCTION) {
          this.debugError = JSON.stringify(error.response?.data)
        }
        if (error.message === 'retryRequest') {
          this.onFeedbackChanged(this.ratingValue)
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
