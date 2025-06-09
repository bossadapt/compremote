<script setup lang="ts">
import type { MouseMoveEvent } from '@/helpers/sharedInterfaces';
defineProps<{
  event: MouseMoveEvent
}>()
</script>
<template>
  <div class="inner">
    <h3>x:</h3>
    <input type="number" v-model="event.x">
    <h3>y:</h3>
    <input type="number" v-model="event.y">
  </div>
</template>
<style scoped>
  .inner{
    display: flex;
    flex-direction: row;
  }
</style>
