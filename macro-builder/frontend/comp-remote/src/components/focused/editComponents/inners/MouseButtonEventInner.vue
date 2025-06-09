<script setup lang="ts">
import { ToggleStatus } from '@/helpers/sharedInterfaces'
import type { MouseButtonEvent } from '@/helpers/sharedInterfaces';
defineProps<{
  event: MouseButtonEvent
}>()
</script>
<template>
  <div class="inner">
    <h3>Toggle Status:</h3>
  <select v-model="event.toggle">
    <option :value="ToggleStatus.PRESSED">Press</option>
    <option :value="ToggleStatus.RELEASED">Release</option>
  </select>
    
    <h3>button:</h3>
    <input type="text" v-model="event.button">
    <!-- TODO: replace this with a button to specifically select a spot from a listener on the backend-->
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
