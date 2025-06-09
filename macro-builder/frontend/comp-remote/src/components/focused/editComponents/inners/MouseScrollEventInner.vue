<script setup lang="ts">
import type { MouseScrollEvent } from '@/helpers/sharedInterfaces'
defineProps<{
  event: MouseScrollEvent
}>()
</script>
<template>
  <div class="inner">
    <h3>Vertical Direction:</h3>
    <input type="number" v-model="event.vertical_direction" />
    <h3>Horizontal Direction:</h3>
    <input type="number" v-model="event.horizontal_direction" />
    <h3>x:</h3>
    <input type="number" v-model="event.x" />
    <h3>y:</h3>
    <input type="number" v-model="event.y" />
  </div>
</template>
<style scoped>
.inner {
  display: flex;
  flex-direction: row;
}
</style>
