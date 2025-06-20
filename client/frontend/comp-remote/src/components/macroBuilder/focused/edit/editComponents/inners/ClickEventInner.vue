<script setup lang="ts">
import type { ClickEvent } from '@/helpers/sharedInterfaces'
import Position from './../helpers/Position.vue'
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
    <div class="section">
        <h3>Click Count: </h3>
        <input type="number" v-model="event.clickCount"/>
    </div>
  </div>
</template>
<style scoped>

</style>
