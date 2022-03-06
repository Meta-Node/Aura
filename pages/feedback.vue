<template>
  <section class="feedback">
    <div class="container feedback__wrapper">
      <div class="grid feedback__card">
        <div class="feedback__card-img">
          <img
            width="106"
            height="106"
            class="img feedback__avatar"
            src="/images/card-img.jpg"
            alt="Avatar"
          />
        </div>
        <div class="feedback__user-info">
          <div class="feedback__username">
            <div class="feedback__block-left">
              <h3 class="feedback__name">
                User<br />
                Name
              </h3>
            </div>
            <div class="feedback__block-right">
              <p class="feedback__lower-text">Low</p>
              <nuxt-link to="/">
                <svg
                  class="profile__share"
                  width="20"
                  height="18"
                  viewBox="0 0 20 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 4H3C1.89543 4 1 4.89543 1 6V15C1 16.1046 1.89543 17 3 17H17C18.1046 17 19 16.1046 19 15V6C19 4.89543 18.1046 4 17 4H14M13 8L10 11M10 11L7 8M10 11L10 1"
                    stroke="#343434"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </nuxt-link>
            </div>
          </div>
          <div class="feedback__about">
            <p class="feedback__info">
              4 months<br />
              116 Connections
            </p>
          </div>
        </div>
      </div>
      <div class="feedback__questions">
        <button
          class="text-button feedback__question-btn"
          @click="onFeedbackClick"
        >
          Rate Chair?
        </button>
        <div v-if="isFeedbackSliderVisible" class="feedback__quality-slider">
          <h3 class="feedback__quality-title">Honesty</h3>
          <feedback-slider
            id="quality"
            type="range"
            :min="-4"
            :max="4"
            :step="1"
            :value="0"
          />
        </div>
        <button
          class="text-button feedback__question-btn"
          @click="onEnergyClick"
        >
          Explore Energy?
        </button>
        <div v-if="isEnergySliderVisible" class="feedback__energy-slider">
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
        <div class="btn__wrapper">
          <button class="text-button feedback__btn">Load More...</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import FeedbackSlider from '~/components/FeedbackSlider.vue'

export default {
  components: { FeedbackSlider },

  data() {
    return {
      isFeedbackSliderVisible: false,
      isEnergySliderVisible: false,
    }
  },
  methods: {
    onFeedbackClick() {
      this.isFeedbackSliderVisible = !this.isFeedbackSliderVisible
    },
    onEnergyClick() {
      this.isEnergySliderVisible = !this.isEnergySliderVisible
    },
  },
}
</script>