<script setup lang="ts">
import ActionMini from './ActionMini.vue'
import { useMacroBuilderStore } from '@/stores/macroBuilder';

let state = useMacroBuilderStore()
</script>

<template>
  <div class="mini-main-container">
    <h1 class="containerHeader">Actions</h1>
    <div class="actions-container">
      <li v-for="action in state.actions">
        <ActionMini :action="action"/>
      </li>
      <ActionMini :action="null"/>
    </div>
  </div>
</template>
<style scoped>
.mini-main-container {
  display: flex;
  flex-direction: column;
  width: 35%;
  min-height: 90vh;
  max-height: 90vh;
  background-color: var(--primary);
  border-radius: 16px;
}
.actions-container{
  overflow-y: auto;
  max-height: 80vh;
}
.containerHeader {
  color: var(--background);
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-size: 64px;
  margin-top: 1%;
  margin-bottom: 0px;
}
</style>
