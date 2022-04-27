<template>
  <div v-if="isLoading" style="margin-top: 40px">
    <app-spinner :is-visible="true" />
  </div>
  <div v-else-if="startedActivityData.length" class="activity__data">
    <div class="activity__filters">
      <app-filter :filters="filters" @filtered="onFiltered" />
    </div>
    <lazy-loading-items
      v-if="activityData.length"
      class="activity__content"
      :items="activityData"
      @updateItems="onUpdateItems"
    >
      <small class="activity__tab-name">Not important / Important</small>
      <ul class="activity__info">
        <activity-info
          v-for="activity in visibleItems"
          :id="activity.id"
          :key="activity.id"
          :from-user="activity.fromProfile"
          :action="activity.action"
          :to-user="activity.toProfile"
          :time="activity.timestamp"
          :is-important="activity.isimportant"
          :is-personal="true"
        />
      </ul>
      <!-- <load-more text="Load More..." /> -->
    </lazy-loading-items>
    <div v-else>You have not been active yet</div>
  </div>

  <div v-else style="margin: 0 auto; text-align: center; margin-top: 20px">
    You have not been active yet
  </div>
</template>

<script>
import AppFilter from '../filters/AppFilter.vue'
import ActivityInfo from '~/components/activity/ActivityInfo.vue'
import activityVue from '~/mixins/activity.js'
import loadItems from '~/mixins/loadItems'

export default {
  components: { ActivityInfo, AppFilter },
  mixins: [activityVue, loadItems],
}
</script>