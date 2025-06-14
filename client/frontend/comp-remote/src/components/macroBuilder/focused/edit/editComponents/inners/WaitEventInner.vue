<script setup lang="ts">
import type { WaitEvent } from '@/helpers/sharedInterfaces'
defineProps<{
  event: WaitEvent
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <h3>Wait in seconds:</h3>
      <input type="number" v-model="event.time" />
    </div>
  </div>
</template>
<style scoped>

</style>
