<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import type { Action } from '../../helpers/sharedInterfaces'
import CreateAction from './CreateAction.vue'
import EditAction from './EditAction.vue'
let state = useMacroBuilderStore()
</script>

<template>
  <div class="focus-main-container">
    <div v-if="state.focusedAction !== null" class="focus-main-header">
      <h1 class="focus-main-header-text" style="cursor: pointer;" @click="state.modalContent='renameFocused'">{{ state.focusedAction.name }}</h1>
      <button
        class="save-button"
        @click="state.playFocused()"
        style="background-color: var(--primary); color: var(--secondary)"
      >
        Play Saved Version
      </button>
      <button class="save-button" @click="state.saveAction(state.focusedAction)">Save</button>
    </div>
    <div v-else>
      <h1 class="focus-main-header-text">Create New Action</h1>
      create
    </div>
    <div class="focus-hr"></div>
    <div class="scrollable-content">
      <EditAction v-if="state.focusedAction !== null"></EditAction>
      <CreateAction v-else></CreateAction>
    </div>
  </div>
</template>

<style scoped>
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
.scrollable-content {
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0; 
}
</style>
