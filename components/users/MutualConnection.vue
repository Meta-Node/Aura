<template>
  <li class="user-v2__humans-list" style="width: 100%">
    <user-item-info :index="index" :user="user" show-aura-verification></user-item-info>
    <div class="user-v2__numbers">
      <p :data-testid="`mutual-connection--${id}-incoming-level`" class="user-v2__num user-v2__num-outbound">
        {{ user.incomingConnectionLevel }}</p>
      <p :class="{'user-v2__num-alert-rating-difference': user.alertDifference}"
         :data-testid="`mutual-connection--${id}-incoming-rating`"
         class="user-v2__num user-v2__num-outbound"
         style="margin: 0px 10px;">
        ({{ user.incomingRatingToConnection !== undefined ? user.incomingRatingToConnection : '-' }})</p>
    </div>
  </li>
</template>

<script>
import UserItemInfo from './UserItemInfo'
import avatar from '~/mixins/avatar'
import energy from '~/mixins/energy'

export default {
  components: {UserItemInfo},
  mixins: [avatar, energy],
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      default: '/',
    },
    id: {
      type: String,
      default: '',
    },
    img: {
      type: String,
      default: '/',
    },
    name: {
      type: String,
      default: 'Name',
    },
    rating: {
      type: Number,
      default: 0,
    },
    inbound: {
      type: String,
      default: '',
    },
    outbound: {
      type: Number,
      default: 0,
    },
  },
}
</script>
