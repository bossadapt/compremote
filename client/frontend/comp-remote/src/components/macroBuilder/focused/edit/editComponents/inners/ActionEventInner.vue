<script setup lang="ts">
import type { ActionEvent } from '@/helpers/sharedInterfaces'
import { useMacroBuilderStore } from '@/stores/macroBuilder'
const state = useMacroBuilderStore()
//   action: string = ''
//   variables: Variable[] = []
//   playCount: number = 1
defineProps<{
  event: ActionEvent
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <h3>Action Name:</h3>
      <input v-model="event.action" type="text" />
    </div>
    <div class="section">
      <h3>Play Count:</h3>
      <input v-model="event.playCount" type="number" />
    </div>
    <div class="section">
      <h3>Variables:</h3>
      <!-- TODO: implement a dropdown add variables from the action mentioned, also add verification that the action exists before save -->
    </div>
  </div>
</template>
<style scoped></style>
