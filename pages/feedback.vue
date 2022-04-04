<template>
  <section class="feedback">
    <div class="container feedback__wrapper">
      <profile-info
        img="/images/card-img.jpg"
        name="User Name"
        rating="Silver"
        date="4 months"
        :connections="116"
        :brightness="brightness"
      />
      <div class="feedback__questions">
        <div class="feedback__quality-wrapper">
          <transition name="fade" mode="out-in">
            <button
              v-if="!isFeedbackSliderVisible"
              class="text-button feedback__question-btn"
              @click="onFeedbackClick"
            >
              Rate User?
            </button>
            <div v-else class="feedback__transition">
              <feedback-slider
                id="quality"
                type="range"
                :min="-5"
                :max="5"
                :step="1"
                :value="0"
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
      <div class="feedback__users">
        <h3 class="feedback__title">Yet To Be Rated</h3>
        <ul class="user-v1-ul">
          <user-v-1
            v-for="(user, idx) in 4"
            :key="idx"
            img="/images/card-img.jpg"
            name="User Name"
            url="/"
          />
        </ul>
        <load-more text="Load More..." />
      </div>
    </div>
  </section>
</template>

<script>
import FeedbackSlider from '~/components/FeedbackSlider.vue'
import ProfileInfo from '~/components/ProfileInfo.vue'
import transition from '~/mixins/transition'

export default {
  components: { FeedbackSlider, ProfileInfo },
  mixins: [transition],

  data() {
    return {
      isFeedbackSliderVisible: false,
      isEnergyWindowVisible: false,
    }
  },
  computed: {
    brightness() {
      return Math.round(10 * Math.random())
    },
  },
  methods: {
    onFeedbackClick() {
      this.isFeedbackSliderVisible = true
    },
    onEnergyClick() {
      this.isEnergySliderVisible = true
    },
    onFeedbackChanged() {
      this.isEnergyWindowVisible = true
    },
  },
}
</script>