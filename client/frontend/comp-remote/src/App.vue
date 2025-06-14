<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ActionMinis from './components/actionMinis/ActionMinisContainer.vue'
import FocusedActions from './components/focused/FocusedAction.vue'
import { useMacroBuilderStore } from './stores/macroBuilder'
import { useRecieverStore } from './stores/reciever'
import Reciever from './components/reciever/Reciever.vue'
const state = useMacroBuilderStore()
const recieverStore = useRecieverStore()
const focusedPage = ref(0);
onMounted(() => {
  state.syncActions(1)
  recieverStore.connect()

})
</script>
<template>
  <link href="https://fonts.googleapis.com/css?family=JetBrains Mono" rel="stylesheet" />
  <div class="nav-bar">
    <button :disabled="focusedPage === 0" class="nav-bar-button" @click="focusedPage=0">Macro Builder</button>
    <button :disabled="focusedPage === 1" class="nav-bar-button" @click="focusedPage=1">Reciever Bridge</button>
  </div>
  <div v-if="state.warningMessage !== null" class="warning-container">
    <h3 class="warning-text">Warning: {{ state.warningMessage }}</h3>
  </div>
  <div v-if="state.isInitializing">
    <h1 class="general-instructions">Initializing with backend</h1>
  </div>
  <div v-else-if="state.isWaitingForInput">
    <h1 class="general-instructions">{{ state.waitingForInputText }}</h1>
  </div>
  <div v-else-if="focusedPage===0" class="main-container">
    <ActionMinis />
    <FocusedActions />
  </div>
  <div v-else class="main-container">
    <Reciever/>
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
td{
    color: var(--text);

}
th{
    color: var(--text);

}
h4{
  color: var(--text);
}
h3{
  color: var(--text);
}
body {
  font-family: 'JetBrains Mono';
  background-color: var(--background);
}
.nav-bar{
  width: 100%;
  height: 2rem;
}
.nav-bar-button{
  cursor: pointer;
  width: 50%;
  font-size: 1rem;
  height: 2rem;
  background-color: var(--background);
  color: var(--primary);
}
.nav-bar-button:disabled{
  color: var(--background);
  background-color: var(--primary);
}
.general-instructions {
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
