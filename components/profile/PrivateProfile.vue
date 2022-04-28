<template>
  <section class="feedback">
    <div v-if="isLoading" style="margin-top: 40px">
      <app-spinner :is-visible="true" />
    </div>
    <div v-else-if="!isLoading && !profile.name" class="container">
      <p style="margin: 0 auto; text-align: center">User not found</p>
    </div>
    <div v-else class="container feedback__wrapper">
      <profile-info
        :img="profileAvatar"
        :name="profile.name"
        :nickname="profile.nickname"
        :rating="profile.rating"
        :date="date"
        :connections="profile.numOfConnections"
        :brightness="brightness"
        @share="onShare"
        @edit="onEdit"
      />
      <div class="feedback__questions">
        <div class="feedback__quality-wrapper">
          <transition name="fade" mode="out-in">
            <button
              v-if="!isFeedbackSliderVisible"
              class="text-button feedback__question-btn"
              @click="onFeedbackClick"
            >
              Rate {{ profile.name.split(' ')[0] }}?
            </button>
            <div v-else class="feedback__transition">
              <feedback-slider
                id="quality"
                type="range"
                :min="-5"
                :max="5"
                :step="1"
                :value="+profile.previousRating || 0"
                @changed="onFeedbackChanged"
              />
            </div>
          </transition>
        </div>
        <transition name="fade" mode="out-in">
          <div v-if="isEnergyWindowVisible" class="feedback__energy-wrapper">
            <!-- <button class="text-button feedback__question-btn">
              Explore Energy?
            </button> -->
            <div class="feedback__energy-slider">
              <h3 class="feedback__energy-title">Energy Transfer</h3>
              <energy-slider
                id="quality"
                type="range"
                :min="0"
                :max="100"
                :step="25"
                :value="0"
              />
            </div>
          </div>
        </transition>
      </div>
      <four-unrated :users="fourUnrated" />
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
import AppSpinner from '~/components/AppSpinner.vue'

import FeedbackSlider from '~/components/FeedbackSlider.vue'
import NicknamePopup from '~/components/popup/NicknamePopup.vue'
import ProfileInfo from '~/components/ProfileInfo.vue'
import { rateUser } from '~/scripts/api/rate.service'
import FourUnrated from '~/components/FourUnrated.vue'
import transition from '~/mixins/transition'
import avatar from '~/mixins/avatar'

export default {
  components: {
    FeedbackSlider,
    ProfileInfo,
    AppSpinner,
    NicknamePopup,

    FourUnrated,
  },
  mixins: [transition, avatar],
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
    connections: {
      type: Object,
      default: () => {},
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
      isFeedbackSliderVisible: false,
      isEnergyWindowVisible: false,
      isAlreadyRated: false,
    }
  },

  computed: {
    img() {
      return this.$route.params.id
    },
  },

  methods: {
    onFeedbackClick() {
      this.isFeedbackSliderVisible = true
    },
    // onEnergyClick() {
    //   this.isEnergySliderVisible = true
    // },
    async onFeedbackChanged(rating) {
      this.$store.commit('app/setLoading', true)
      await rateUser({
        rating,
        fromBrightId: localStorage.getItem('brightId'),
        toBrightId: this.profile.id,
      })
      this.$store.commit('app/setLoading', false)

      this.$store.commit('toast/addToast', {
        text: 'Successfully updated',
        color: 'success',
      })

      if (rating > 0.5) {
        this.$router.push('/energy?tab=Energy')
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
  },
}
</script>