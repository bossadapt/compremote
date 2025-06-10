<script setup lang="ts">
import { ToggleStatus } from '@/helpers/sharedInterfaces'
import type { MouseButtonEvent } from '@/helpers/sharedInterfaces';
import Position from '../Position.vue';
defineProps<{
  event: MouseButtonEvent
  idx:number
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
    <Position :x="event.x" :y="event.y" :idx="idx"></Position>
  </div>
</template>
<style scoped>
  .inner{
    display: flex;
    flex-direction: row;
  }
</style>
