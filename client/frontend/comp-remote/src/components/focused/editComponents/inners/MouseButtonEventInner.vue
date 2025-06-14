<script setup lang="ts">
import { ToggleStatus } from '@/helpers/sharedInterfaces'
import type { MouseButtonEvent } from '@/helpers/sharedInterfaces'
import Position from '../Position.vue'
import { useMacroBuilderStore } from '@/stores/macroBuilder'
const state = useMacroBuilderStore()
defineProps<{
  event: MouseButtonEvent
  idx: number
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <h3>Toggle Status:</h3>
      <select v-model="event.toggle">
        <option :value="ToggleStatus.PRESSED">Press</option>
        <option :value="ToggleStatus.RELEASED">Release</option>
      </select>
    </div>
    <div class="section">
      <h3>button:</h3>
      <button @click="state.getButton(idx)">{{ event.button }}</button>
      <Position :x="event.x" :y="event.y" :idx="idx"></Position>
    </div>
  </div>
</template>
<style scoped>

</style>
