<script setup lang="ts">
import type { RangeMouseMoveEvent } from '@/helpers/sharedInterfaces'
import Position from './../helpers/Position.vue'
import { useMacroBuilderStore } from '@/stores/macroBuilder';
const state = useMacroBuilderStore()
defineProps<{
  event: RangeMouseMoveEvent
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <Position :event="event" x-id="x1" y-id="y1" ></Position>
    </div>
    <div class="section">
      <Position :event="event" x-id="x2" y-id="y2"></Position>
    </div>
</div>
</template>
<style scoped>

</style>
