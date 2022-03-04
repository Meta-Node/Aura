<template>
  <section class="feedback-2">
    <div class="container feedback-2__wrapper">
      <div class="grid feedback-2__card">
        <div class="feedback-2__card-img">
          <img
            class="img feedback-2__avatar"
            src="/images/card-img.jpg"
            alt="Avatar"
          />
        </div>
        <div class="feedback-2__user-info">
          <div class="feedback-2__username">
            <div class="feedback-2__block-left">
              <h3 class="feedback-2__name">
                User<br />
                Name
              </h3>
            </div>
            <div class="feedback-2__block-right">
              <p class="feedback-2__lower-text">Low</p>
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
          <div class="feedback-2__about">
            <p class="feedback-2__info">
              4 months<br />
              116 Connections
            </p>
          </div>
        </div>
      </div>
      <div class="feedback-2__slider"></div>
      <div class="feedback-2__users">
        <h3 class="feedback-2__title">Yet To Be Rated</h3>
        <ul class="feedback-2__humans">
          <li class="feedback-2__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="feedback-2__image"
              />
              <p class="feedback-2__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="feedback-2__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="feedback-2__image"
              />
              <p class="feedback-2__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="feedback-2__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="feedback-2__image"
              />
              <p class="feedback-2__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="feedback-2__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="feedback-2__image"
              />
              <p class="feedback-2__tag">User Name</p>
            </nuxt-link>
          </li>
        </ul>
        <div class="btn__wrapper">
          <button class="text-button feedback-2__btn">Load More...</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  mounted() {
    const slider = document.getElementById('myRange')
    const output = document.getElementById('demo')
    output.innerHTML = slider.value

    slider.oninput = function () {
      output.innerHTML = this.value
    }
  },
}
</script>