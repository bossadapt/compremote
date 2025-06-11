<script setup lang="ts">
import type { TextEvent } from '@/helpers/sharedInterfaces';

defineProps<{
  event: TextEvent
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
        <h3>Text:</h3>
        <textarea type="text" v-model="event.text"></textarea>
    </div>
  </div>
</template>
<style></style>
