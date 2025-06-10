<script setup lang="ts">
import type { MouseMoveEvent } from '@/helpers/sharedInterfaces';
import Position from '../Position.vue';
defineProps<{
  event: MouseMoveEvent
  idx:number
}>()
</script>
<template>
  <div class="inner">
    <Position :x="event.x" :y="event.y" :idx="idx"></Position>
  </div>
</template>
<style scoped>
  .inner{
    display: flex;
    flex-direction: row;
  }
</style>
