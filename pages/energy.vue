<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <div class="energy__main-filter">
        <button class="energy__main-button">Flow</button>
        <button class="energy__main-button">Overview</button>
      </div>
      <div class="energy__input-wrapper">
        <app-input
          id="search"
          class="input-wrapper"
          type="text"
          placeholder="Search..."
          :required="true"
        />
      </div>
      <div class="energy__statistic">
        <div class="energy__stat-filter">
          <button class="energy__stat-button">Inbound</button>
          <button class="energy__stat-button">Outbound</button>
        </div>
        <div class="energy__switch-wrapper">
          <div class="energy__switch-button">
            <button class="energy__button">Name V</button>
          </div>
          <div class="energy__switch-button">
            <button class="energy__button">Amount V</button>
          </div>
        </div>
        <div class="energy__humans-stat">
          <ul class="energy__humans">
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">190.7%</p>
                <p class="energy__num energy__num-outbound">148.6%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">4,721.2%</p>
                <p class="energy__num energy__num-outbound">3,226.8%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">316.4%</p>
                <p class="energy__num energy__num-outbound">357.1%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">1,297.6%</p>
                <p class="energy__num energy__num-outbound">1,492.4%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">48.3%</p>
                <p class="energy__num energy__num-outbound">39.4%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">190.7%</p>
                <p class="energy__num energy__num-outbound">148.6%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">4,721.2%</p>
                <p class="energy__num energy__num-outbound">3,226.8%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">316.4%</p>
                <p class="energy__num energy__num-outbound">357.1%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">1,297.6%</p>
                <p class="energy__num energy__num-outbound">1,492.4%</p>
              </div>
            </li>
            <li class="energy__humans-list">
              <nuxt-link to="/" class="energy__username">
                <img
                  src="/images/card-img.jpg"
                  alt="Avatar"
                  class="energy__image"
                />
                <p class="energy__tag">User Name</p>
              </nuxt-link>
              <div class="energy__numbers">
                <p class="energy__num energy__num-inbound">48.3%</p>
                <p class="energy__num energy__num-outbound">39.4%</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="btn__wrapper">
          <button class="text-button energy__btn">Load More...</button>
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