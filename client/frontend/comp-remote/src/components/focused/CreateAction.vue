<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import { ref, type Ref } from 'vue'
let state = useMacroBuilderStore()
const inputName: Ref<string>= ref("")
</script>
<template>
  <div class="container">
    <h2>Name</h2>
    <input v-model="inputName" placeholder="name required" />
    <button v-on:click="state.createActionByRecording(inputName)">Start with recording</button>
    <button v-on:click="state.addAction({ name: inputName, events: [] })">Start Empty</button>
  </div>
</template>
<style scoped>
.container {
  margin-left: 1%;
  margin-right: 1%;
  display: flex;
  flex-direction: column;
}
h2 {
  font-size: 40px;
  color: var(--primary);
  margin-bottom: 0px;
}
input {
  width: 40%;
  font-size: 20px;
}
button {
    width: 40%;

  font-size: 20px;
  cursor: pointer;
  color: var(--primary);
  border: 0px;
  margin-top: 1%;
  border-radius: 5px;
  background-color: var(--secondary);
}
</style>
