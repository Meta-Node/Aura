<template>
  <main class="landing">
    <div class="container landing__wrapper">
      <div class="img landing__sphere"></div>
      <div class="landing__sphere-wrapper">
        <h1 class="landing__h1">Discover & grow your Aura...</h1>
      </div>
      <div class="landing__text-wrapper">
        <h3 class="landing__title">
          Your Aura represents power & influence upon the Auracle.
        </h3>
        <p class="landing__text">
          Smartly connect to and rate others to grow your Aura. Help those
          around you grow theirs.
        </p>
        <p class="landing__text">
          But take care, for making poor decisions will drain your power and
          harm those around you.
        </p>
      </div>
      <div class="landing__input-form">
        <h3 class="landing__input-name">Early Access</h3>
        <form class="form" novalidate>
          <div class="form__inputs">
            <div class="input-wrapper form__input-wrapper">
              <input
                id="explorer"
                class="input form__input"
                type="text"
                placeholder="Explorer Code"
                required
                data-validation="required"
              />
              <label for="explorer" class="label form__label"></label>
              <!-- <small class="form__input-error">Error</small> -->
            </div>
            <div class="input-wrapper form__input-wrapper">
              <input
                id="password"
                class="input form__input"
                type="password"
                placeholder="Password"
                required
                data-validation="required"
              />
              <label for="password" class="label form__label"></label>
              <!-- <small class="form__input-error">Error</small> -->
            </div>
          </div>
          <button type="submit" class="text-button form__btn">
            <p class="form__btn-text">Sign In</p>
          </button>
        </form>
      </div>
    </div>
  </main>
</template>