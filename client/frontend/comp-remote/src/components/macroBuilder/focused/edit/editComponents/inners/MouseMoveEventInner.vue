<script setup lang="ts">
import type { MouseMoveEvent } from '@/helpers/sharedInterfaces'
import Position from './../helpers/Position.vue'
defineProps<{
  event: MouseMoveEvent
  idx: number
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <Position :event="event" x-id="x" y-id="y" ></Position>
    </div>
  </div>
</template>
<style scoped>

</style>
