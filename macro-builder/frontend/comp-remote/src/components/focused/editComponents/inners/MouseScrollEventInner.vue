<script setup lang="ts">
import type { MouseScrollEvent } from '@/helpers/sharedInterfaces'
import Position from '../Position.vue';
defineProps<{
  event: MouseScrollEvent,
  idx:number
}>()
</script>
<template>
  <div class="inner">
    <h3>Vertical Direction:</h3>
    <input type="number" v-model="event.vertical_direction" />
    <h3>Horizontal Direction:</h3>
    <input type="number" v-model="event.horizontal_direction" />
    <Position :x="event.x" :y="event.y" :idx="idx"></Position>
  </div>
</template>
<style scoped>
.inner {
  display: flex;
  flex-direction: row;
}
</style>
