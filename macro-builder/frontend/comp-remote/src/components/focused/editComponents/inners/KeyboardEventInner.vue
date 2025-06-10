<script setup lang="ts">
import { ToggleStatus } from '@/helpers/sharedInterfaces'
import type { KeyboardEvent } from '@/helpers/sharedInterfaces';
import { useStateStore } from '@/stores/state';
let state = useStateStore()
defineProps<{
  event: KeyboardEvent,
  idx:number
}>()
</script>
<template>
  <div class="inner">
    <h3>Toggle Status:</h3>
  <select v-model="event.toggle" style="font-size: 20px;">
    <option :value="ToggleStatus.PRESSED">Press</option>
    <option :value="ToggleStatus.RELEASED">Release</option>
  </select>
    <h3>Key:</h3>
    <button @click="state.getKey(idx)" class="key-button">{{ event.key }}</button>
  </div>
</template>
<style scoped>
  .inner{
    display: flex;
    flex-direction: row;
  }
  .key-button{
    font-size: 20px;
    min-width: 50px;
  }
</style>
