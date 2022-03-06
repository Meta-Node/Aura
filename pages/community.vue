<template>
  <section class="community">
    <div class="container community__wrapper">
      <div class="community__search">
        <h3 class="community__search-title">Find A Connection</h3>
        <app-input
          id="search"
          class="community__input-wrapper"
          type="text"
          placeholder="Search..."
          :required="true"
          :is-search="true"
        />
      </div>
      <div class="community__users">
        <h3 class="community__humans-title">Your Connections</h3>
        <div class="community__switch-wrapper">
          <div class="community__switch-button">
            <button class="community__button">Name V</button>
          </div>
          <div class="community__switch-button">
            <button class="community__button">Rating V</button>
          </div>
          <div class="community__switch-button">
            <button class="community__button">Unrated</button>
          </div>
        </div>
        <ul class="community__humans">
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
          <li class="community__item">
            <nuxt-link to="/">
              <img
                src="/images/card-img.jpg"
                alt="Avatar"
                class="community__image"
              />
              <p class="community__tag">User Name</p>
            </nuxt-link>
          </li>
        </ul>
        <div class="btn__wrapper">
          <button class="text-button community__btn">Load More...</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppInput from '~/components/AppInput.vue'
export default {
  components: { AppInput },
}
</script>