<template>
  <div>
    <div v-if="debugError" class="debug-error">debug error: {{ debugError }}</div>
    <template v-if="profile.name">
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
            :min="0"
            :user-id="profile ? profile.id : undefined"
            type="range"
            @input="changeEnergy"
          />
        </div>
        <button v-else
                :class="{'feedback__energy__energize-button--disabled':energizeDisabled}"
                :disabled="energizeDisabled"
                class="feedback__energy__energize-button"
                @click="energize = true">
            <span class="material-symbols-rounded">
              electric_bolt
            </span>energize <span v-if="energizeDisabled">(needs honesty > 1)</span>
        </button>
      </div>
      <div class="feedback__save">
        <button class="feedback__save__button" data-testid="feedback-quality-confirm" @click="onFeedbackChanged">
          save changes
        </button>
      </div>
    </template>
    <mutual-connections
      :loading-profile-data="loadingProfileData"
      :profile="profile"
      :profile-calls-done="profileCallsDone"
      :profile-inbound-energy="profileInboundEnergy"
      :profile-incoming-connections="profileIncomingConnections"
      :profile-incoming-ratings="profileIncomingRatings"
      :profile-outbound-connections="profileOutboundConnections"
      :profile-rated-users="profileRatedUsers"
      :profile-transferred-energy="profileTransferredEnergy"/>
  </div>
</template>

<script>
import MutualConnections from './MutualConnections'

import FeedbackSlider from '~/components/FeedbackSlider.vue'
import {rateUser} from '~/scripts/api/rate.service'
import transition from '~/mixins/transition'
import avatar from '~/mixins/avatar'
import {IS_PRODUCTION, TOAST_ERROR, TOAST_SUCCESS} from "~/utils/constants";
import energySet from "~/mixins/energySet";
import {deepCopy} from "~/utils";
import unsavedChanges from "~/mixins/unsavedChanges";

export default {
  components: {
    FeedbackSlider,
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
    profileCallsDone: {
      type: Number,
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
    loadingProfileData: {
      type: Boolean,
    },
    profileIncomingConnections: {
      type: Array,
      default: () => [],
    },
    profileOutboundConnections: {
      type: Array,
      default: () => [],
    },
    profileInboundEnergy: {
      type: Array,
      default: () => [],
    },
    profileTransferredEnergy: {
      type: Array,
      default: () => [],
    },
    profileRatedUsers: {
      type: Array,
      default: () => [],
    },
    profileIncomingRatings: {
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
      return this.ratingValue >= 1 && (this.energyValue > 0 || this.energize)
    },
    energizeDisabled() {
      return this.ratingValue < 1
    },
    previousRating() {
      return +this.profile.previousRating || 0
    },
    img() {
      return this.$route.params.id
    },
    prevTransferredEnergyToProfile() {
      return Number(this.$store.state.energy.prevTransferredEnergy?.find(
        en => en.toBrightId === this.profile?.id
      )?.amount || 0)
    },
    transferredEnergyToProfile() {
      return Number(this.$store.state.energy.transferredEnergy?.find(
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
          this.changeEnergy(this.prevTransferredEnergyToProfile)
        }
      }
    },
    transferredEnergyToProfile: {
      immediate: true,
      handler(newValue, _oldValue) {
        this.energyValue = Number(newValue);
      }
    },
    isLoadingInitialData: {
      immediate: true,
      handler(newValue, _oldValue) {
        if (!newValue) {
          this.energyData = deepCopy(this.$store.state.energy.prevTransferredEnergy)
          this.ratingValue = this.previousRating
          this.energize = this.transferredEnergyToProfile > 0;
        }
      }
    }
  },
  methods: {
    onEdit() {
      this.$refs.popup.openPopup()
    },
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
        if (this.ratingValue >= 1 && this.prevTransferredEnergyToProfile !== this.transferredEnergyToProfile) {
          await this.updateEnergy(false)
        } else {
          this.$store.commit('app/setLoading', false)
        }
        this.$store.commit('toast/addToast', {
          text: 'Updated',
          color: TOAST_SUCCESS,
        })
        this.hasUnsavedChanges = false;
        this.$emit('afterSave')
      } catch (error) {
        this.$store.commit('app/setLoading', false)
        if (!IS_PRODUCTION) {
          this.debugError = JSON.stringify(error.response?.data)
        }
        if (error.message === 'retryRequest') {
          this.onFeedbackChanged()
        } else {
          this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
        }
      }
    },
    onShare() {
      this.$emit('share')
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
