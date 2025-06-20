<script setup lang="ts">
import type { MouseMoveEvent, RangeMouseMoveEvent } from '@/helpers/sharedInterfaces';
import { useMacroBuilderStore } from '@/stores/macroBuilder'

let state = useMacroBuilderStore()
defineProps<{
  event: MouseMoveEvent | RangeMouseMoveEvent
  xId: string
  yId: string
}>()
</script>
<template>
  <div class="section">
    <button @click="state.getCord(event.id,xId,yId)">X: {{ (event as any)[xId] }} | Y:{{ (event as any)[xId] }}</button>
  </div>
</template>
<style></style>
