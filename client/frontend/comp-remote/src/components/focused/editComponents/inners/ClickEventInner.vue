<script setup lang="ts">
import type { ClickEvent } from '@/helpers/sharedInterfaces'
import Position from '../Position.vue'
import { useMacroBuilderStore } from '@/stores/macroBuilder'
const state = useMacroBuilderStore()
defineProps<{
  event: ClickEvent
  idx: number
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <h3>Button:</h3>
      <button @click="state.getButton(idx)">{{ event.button }}</button>
    </div>
    <Position :x="event.x" :y="event.y" :idx="idx"></Position>
    <div class="section">
        <h3>Click Count: </h3>
        <input type="number" v-model="event.clickCount"> {{ event.clickCount }}</input>
    </div>
  </div>
</template>
<style scoped>

</style>
