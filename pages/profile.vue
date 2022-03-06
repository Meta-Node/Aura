<template>
  <section class="profile">
    <div class="container profile__wrapper">
      <div class="grid profile__card">
        <div class="profile__card-img">
          <img
            width="106"
            height="106"
            class="img profile__avatar"
            src="/images/card-img.jpg"
            alt="Avatar"
          />
        </div>
        <div class="profile__user-info">
          <div class="profile__username">
            <div class="profile__block-left">
              <h3 class="profile__name">
                User<br />
                Name
              </h3>
            </div>
            <div class="profile__block-right">
              <p class="profile__lower-text">Low</p>
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
          <div class="profile__about">
            <p class="profile__info">
              4 months<br />
              116 Connections
            </p>
          </div>
        </div>
      </div>
      <div class="profile__sphere"></div>
      <div class="profile__users">
        <h3 class="profile__title">Yet To Be Rated</h3>
        <ul class="user-v1-ul">
          <user-v-1
            v-for="(user, idx) in 3"
            :key="idx"
            img="/images/card-img.jpg"
            name="User Name"
            url="/"
          />
        </ul>
        <div class="btn__wrapper">
          <button class="text-button profile__btn">Load More...</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UserV1 from '~/components/UserV1.vue'
export default {
  components: { UserV1 },
}
</script>