<script setup lang="ts">
import { ToggleStatus } from '@/helpers/sharedInterfaces'
import type { KeyboardEvent } from '@/helpers/sharedInterfaces';
defineProps<{
  event: KeyboardEvent
}>()
</script>
<template>
  <div class="inner">
    <h3>Toggle Status:</h3>
  <select v-model="event.toggle">
    <option :value="ToggleStatus.PRESSED">Press</option>
    <option :value="ToggleStatus.RELEASED">Release</option>
  </select>
    <h3>Key:</h3>
    <input type="text" v-model="event.key">
  </div>
</template>
<style scoped>
  .inner{
    display: flex;
    flex-direction: row;
  }
</style>
