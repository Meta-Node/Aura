<template>
  <section class="feedback">
    <div v-if="isLoading" style="margin-top: 40px">
      <app-spinner :is-visible="true" />
    </div>
    <div v-else-if="!isLoading && !userInfo.name" class="container">
      User not found
    </div>
    <div v-else class="container feedback__wrapper">
      <profile-info
        :img="userInfo.photo"
        :name="userInfo.name"
        :rating="userInfo.rating"
        :date="difDate.value"
        :connections="userInfo.numOfConnections"
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
              Rate {{ userInfo.name.split(' ')[0] }}?
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
            v-for="user in connections"
            :key="user.id"
            :img="user.photo"
            :name="user.name"
            :url="`/profile/${user.id}`"
          />
        </ul>
      </div>
    </div>
    <nickname-popup ref="popup" :to-bright-id="userInfo.id" />
  </section>
</template>

<script>
import AppSpinner from '~/components/AppSpinner.vue'
import FeedbackSlider from '~/components/FeedbackSlider.vue'
import NicknamePopup from '~/components/NicknamePopup.vue'
import ProfileInfo from '~/components/ProfileInfo.vue'
import transition from '~/mixins/transition'
import { getProfile } from '~/scripts/api/connections.service'
import { rateUser } from '~/scripts/api/rate.service'

export default {
  components: { FeedbackSlider, ProfileInfo, AppSpinner, NicknamePopup },
  mixins: [transition],

  data() {
    return {
      isFeedbackSliderVisible: false,
      isEnergyWindowVisible: false,
      isLoading: true,
      userInfo: {},
      connections: [],
      difDate: {},
    }
  },
  computed: {
    brightness() {
      return this.userInfo.rating / 10
    },
  },
  async mounted() {
    const brightId = this.$route.params.id
    if (this.$route.params.id === localStorage.getItem('brightId')) {
      this.$router.push('/profile/')
      return
    }
    this.isLoading = true

    const profileData = JSON.parse(localStorage.getItem('profileData') || '[]')

    const connections = profileData.connections

    this.userInfo = connections.find(con => con.id === brightId)

    this.connections = profileData.connections.filter(
      con => con.id !== brightId
    )

    const res = await getProfile(brightId)
    this.userInfo = { ...this.userInfo, ...res.data }
    this.getDate()
    this.isLoading = false
  },
  methods: {
    onFeedbackClick() {
      this.isFeedbackSliderVisible = true
    },
    onEnergyClick() {
      this.isEnergySliderVisible = true
    },
    async onFeedbackChanged(rating) {
      this.$store.commit('app/setLoading', true)
      await rateUser({
        rating,
        fromBrightId: localStorage.getItem('brightId'),
        toBrightId: this.userInfo.id,
      })
      this.$store.commit('app/setLoading', false)

      this.$store.commit('toast/addToast', {
        text: 'Successfully updated',
        color: 'success',
      })

      if (rating > 0.5) {
        this.$router.push('/energy/')
      }
    },
    getDate() {
      const today = new Date()

      const reg = new Date(this.userInfo.timestamp)

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
        this.difDate[key] = todayDate[key] - regDate[key]
      })

      if (this.difDate.year >= 1) {
        this.difDate.value = this.difDate.year + ' year(s)'
        return
      }

      if (this.difDate.year < 1 && this.difDate.month >= 1) {
        this.difDate.value = this.difDate.month + ' month(s)'
        return
      }

      this.difDate.value = '< 1 month'
    },
    async onShare() {
      const { copyToClipboard } = await import(
        '~/scripts/utils/copyToClipboard'
      )
      copyToClipboard(location.href)
      this.$store.commit('toast/addToast', {
        text: 'Link was coppied to your clipboard',
        color: 'primary',
      })
    },
    onEdit() {
      this.$refs.popup.openPopup()
    },
  },
}
</script>