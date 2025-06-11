<script setup lang="ts">
import { TypeEnum } from '@/helpers/sharedInterfaces'
import { useStateStore } from '@/stores/state'
import { ref } from 'vue'
let state = useStateStore()
let props = defineProps<{
  idx: number
  typeParam: TypeEnum
}>()
let typeToAddAfter = ref(props.typeParam)
</script>
<template>
  <div style="display: flex; flex-direction: row">
    <select v-model="typeToAddAfter" class="main-add-select">
      <option :value="TypeEnum.KeyEvent">Key Event</option>
      <option :value="TypeEnum.MouseButtonEvent">Mouse Button Event</option>
      <option :value="TypeEnum.MouseMoveEvent">Mouse Move Event</option>
      <option :value="TypeEnum.MouseScrollEvent">Mouse Scroll Event</option>
      <option :value="TypeEnum.WaitEvent">Wait Event</option>
      <option :value="TypeEnum.BrowserEvent">Browser Event</option>
      <option :value="TypeEnum.TextEvent">Text Event</option>
    </select>
    <button class="main-add-button" @click="state.addEvent(idx, typeToAddAfter)">ADD AFTER</button>
  </div>
</template>
<style scoped>
.main-add-select {
  width: 50%;
  background-color: var(--background);
  color: var(--accent);
  font-size: 20px;
  border: 1px;
  border-style: inset;
}
.main-add-button {
  width: 50%;
  font-size: 20px;
  background-color: var(--background);
  color: var(--accent);
  border: 1px;
  border-style: inset;
  cursor: pointer;
}
</style>
