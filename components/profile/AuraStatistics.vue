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
        <td id="energyIn" data-testid="aura-statistics-energy-in">{{ profileInboundEnergy.length }}</td>
        <td id="energyOut" data-testid="aura-statistics-energy-out">{{ profileTransferedEnergy.length }}</td>
      </tr>
      <tr>
        <td>honesty</td>
        <td id="honestyIn" data-testid="aura-statistics-honesty-in">{{ profileIncomingRatings.length }}</td>
        <td id="honestyOut" data-testid="aura-statistics-honesty-out">{{ profileRatedUsers.length }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

export default {
  name: "AuraStatistics",
  props: {
    loadingProfileData: {
      type: Boolean,
    },
    profileInboundEnergy: {
      type: Array,
      default: () => [],
    },
    profileTransferedEnergy: {
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
}
</script>

<style scoped>

</style>
