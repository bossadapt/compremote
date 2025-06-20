<script setup lang="ts">
import type { MouseScrollEvent } from '@/helpers/sharedInterfaces'
import Position from './../helpers/Position.vue'
defineProps<{
  event: MouseScrollEvent
  idx: number
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <h3>Vertical Direction:</h3>
      <input type="number" v-model="event.vertical_direction" />
    </div>
    <div class="section">
      <h3>Horizontal Direction:</h3>
      <input type="number" v-model="event.horizontal_direction" />
    </div>
    <div class="section">
    </div>
  </div>
</template>
