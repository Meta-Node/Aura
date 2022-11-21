<template>
  <div>
    <h3 class="aura-statistics-title">
      Aura Statistics
    </h3>
    <app-spinner
      v-if="loadingProfileData"
      ref="indicator"
      :is-visible="true"
      classes="load-more"
    />
    <table v-else class="aura-statistics">
      <tbody>
      <tr>
        <th>Type</th>
        <th>In</th>
        <th>Out</th>
      </tr>
      <tr>
        <td>energy transfer</td>
        <td id="energyIn" data-testid="aura-statistics-energy-in" class="aura-statistics__detail-button"
            :class="{'aura-statistics__detail-button-active': stat === RATING_INBOUND_STAT}"
            @click="() => setStat(RATING_INBOUND_STAT)">
          {{ profileInboundEnergy.length }}
        </td>
        <td id="energyOut" data-testid="aura-statistics-energy-out" class="aura-statistics__detail-button"
            :class="{'aura-statistics__detail-button-active': stat === RATING_OUTBOUND_STAT}"
            @click="() => setStat(RATING_OUTBOUND_STAT)">
          {{ profileTransferredEnergy.length }}
        </td>
      </tr>
      <tr>
        <td>honesty</td>
        <td id="honestyIn" data-testid="aura-statistics-honesty-in" class="aura-statistics__detail-button"
            :class="{'aura-statistics__detail-button-active': stat === ENERGY_INBOUND_STAT}"
            @click="() => setStat(ENERGY_INBOUND_STAT)">
          {{ profileIncomingRatings.length }}
        </td>
        <td id="honestyOut" data-testid="aura-statistics-honesty-out" class="aura-statistics__detail-button"
            :class="{'aura-statistics__detail-button-active': stat === ENERGY_OUTBOUND_STAT}"
            @click="() => setStat(ENERGY_OUTBOUND_STAT)">
          {{ profileRatedUsers.length }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {ENERGY_INBOUND_STAT, ENERGY_OUTBOUND_STAT, RATING_INBOUND_STAT, RATING_OUTBOUND_STAT} from "~/utils/constants";

export default {
  name: "AuraStatistics",
  props: {
    stat: {
      type: String
    },
    loadingProfileData: {
      type: Boolean,
    },
    profileInboundEnergy: {
      type: Array,
      default: () => [],
    },
    profileTransferredEnergy: {
      type: Array,
      default: () => [],
    },
    profileRatedUsers: {
      type: Array,
      default: () => [],
    },
    profileIncomingRatings: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      RATING_INBOUND_STAT,
      RATING_OUTBOUND_STAT,
      ENERGY_INBOUND_STAT,
      ENERGY_OUTBOUND_STAT,
    }
  },
  methods: {
    setStat(stat) {
      this.$router.replace({query: {...this.$route.query, stat}})
    }
  }
}
</script>

<style scoped>

</style>
