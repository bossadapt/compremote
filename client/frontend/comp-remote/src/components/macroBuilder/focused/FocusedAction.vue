<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import CreateAction from './create/CreateAction.vue'
import EditAction from './edit/EditAction.vue'
let state = useMacroBuilderStore()
</script>

<template>
  <div class="focus-main-container">
    <EditAction v-if="state.focusedAction!==null"/>
    <CreateAction v-else/>
  </div>
</template>
<style>
.focus-main-container {
    width: 65%;
  display: flex;
  flex-direction: column;
  height: 91vh;
}
.focus-main-header {
  width: 100%;
  display: flex;
  flex-direction: row;
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--background);
}
.focus-main-header-text {
  color: var(--primary);
  flex: 1 1 0;
  min-width: 0;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-size: 64px;
  margin-bottom: 0px;
  margin-top: 1%;
  overflow-wrap: break-word;
}
.save-button {
  cursor: pointer;
  flex: 0 0 10%;
  background-color: var(--secondary);
  border: 0px;
  font-size: 20px;
  color: var(--primary);
}
.focus-hr {
  height: 9px;
  width: 100%;
  background-image: linear-gradient(to right, var(--primary), 5%, var(--secondary));
}
</style>
