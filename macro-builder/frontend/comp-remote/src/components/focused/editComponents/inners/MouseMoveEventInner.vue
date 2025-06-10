<script setup lang="ts">
import type { MouseMoveEvent } from '@/helpers/sharedInterfaces'
import Position from '../Position.vue'
defineProps<{
  event: MouseMoveEvent
  idx: number
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <Position :x="event.x" :y="event.y" :idx="idx"></Position>
    </div>
  </div>
</template>
<style scoped>

</style>
