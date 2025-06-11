<script setup lang="ts">
import type { BrowserEvent } from '@/helpers/sharedInterfaces';

defineProps<{
  event: BrowserEvent
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
        <h3>New Window:</h3>
        <input type="checkbox" v-model="event.newWindow"></input>
    </div>
    <div class="section">
        <h3>URL:</h3>
        <input type="text" v-model="event.url"></input>
    </div>
  </div>
</template>
<style></style>
