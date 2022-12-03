<template>
  <li class="user-v2__humans-list" style="width: 100%">
    <user-item-info :index="index" :test-namespace="testNamespace"
                    :user="user"
                    show-aura-verification></user-item-info>
    <template v-if="isInbound">
      <div class="user-v2__numbers">
        <p :data-testid="`mutual-connection--${id}-incoming-level`" class="user-v2__num user-v2__num-outbound">
          {{ user.incomingConnectionLevel }}</p>
        <p :data-testid="`mutual-connection--${id}-incoming-rating`" class="user-v2__num user-v2__num-outbound"
           style="margin: 0px 10px;">
          ({{ user.incomingRatingToConnection !== undefined ? user.incomingRatingToConnection : '-' }})</p>
      </div>
    </template>
    <template v-else>
      <div class="user-v2__numbers">
        <p :data-testid="`mutual-connection--${id}-outbound-level`" class="user-v2__num user-v2__num-outbound">
          {{ user.outboundConnectionLevel }}</p>
        <p :data-testid="`mutual-connection--${id}-outbound-rating`" class="user-v2__num user-v2__num-outbound"
           style="margin: 0px 10px;">
          ({{ user.outgoingRatingToMutualConnection !== undefined ? user.outgoingRatingToMutualConnection : '-' }})</p>
      </div>
    </template>
  </li>
</template>

<script>
import UserItemInfo from './UserItemInfo'
import avatar from '~/mixins/avatar'
import energy from '~/mixins/energy'
import {MUTUAL_CONNECTIONS_TEST_NAMESPACE} from "~/utils/constants";

export default {
  components: {UserItemInfo},
  mixins: [avatar, energy],
  props: {
    isInbound: {
      type: Boolean
    },
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
  data() {
    return {
      testNamespace: MUTUAL_CONNECTIONS_TEST_NAMESPACE
    }
  },
}
</script>
