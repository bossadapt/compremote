<script setup lang="ts">
import type {  WaitEvent } from '@/helpers/sharedInterfaces'
defineProps<{
  event: WaitEvent
}>()
</script>
<template>
  <div class="inner">
    <h3>Wait in seconds:</h3>
    <input type="number" v-model="event.time" />
  </div>
</template>
<style scoped>
.inner {
  display: flex;
  flex-direction: row;
}
</style>
