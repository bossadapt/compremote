<script setup lang="ts">
import { onMounted } from 'vue'
import ActionMinis from './components/actionMinis/ActionMinisContainer.vue'
import FocusedActions from './components/focused/FocusedAction.vue'
import { useStateStore } from './stores/state'
const state = useStateStore()
onMounted(() => {
  state.syncActions()
})
</script>

<template>
  <div v-if="state.warningMessage !== null" class="warning-container">
    <h3 class="warning-text">Warning: {{ state.warningMessage }}</h3>
  </div>
  <div v-if="state.isInitializing"></div>
  <div v-else-if="state.isRecording">
    <h1 class="recording-message">RECORDING IN PROCESS(Press Escape to Finish Recording)</h1>
  </div>
  <div v-else class="main-container">
    <link href="https://fonts.googleapis.com/css?family=JetBrains Mono" rel="stylesheet" />
    <ActionMinis />
    <FocusedActions />
  </div>
</template>

<style>
:root {
  --text: #eaeef2;
  --background: #040608;
  --primary: #a1bed4;
  --secondary: #2b5371;
  --accent: #5395c8;
  --danger: #a71a1a;
}
body {
  font-family: 'JetBrains Mono';
  background-color: var(--background);
}
.recording-message {
  font-size: x-large;
  color: red;
  width: 100%;
  height: 100%;
}
.warning-container {
  background-color: var(--danger);
}
.warning-text {
  margin-top: 0px;
  color: var(--background);
  text-align: center;
}
.main-container {
  display: flex;
  flex-direction: row;
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  width: 96%;
  overflow-y: scroll;
}
</style>
