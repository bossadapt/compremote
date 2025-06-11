<script setup lang="ts">
import { useStateStore } from '@/stores/state'

let state = useStateStore()
defineProps<{
  idx: number
  x: number
  y: number
}>()
</script>
<template>
  <div class="section">
    <button @click="state.getCord(idx)">X: {{ x }} | Y:{{ y }}</button>
  </div>
</template>
<style></style>
