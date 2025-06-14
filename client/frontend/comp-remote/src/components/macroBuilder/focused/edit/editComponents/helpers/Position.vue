<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'

let state = useMacroBuilderStore()
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
