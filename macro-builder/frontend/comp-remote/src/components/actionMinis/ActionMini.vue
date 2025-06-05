<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import type { Action } from '../../helpers/sharedInterfaces'
let state = useStateStore()
defineProps<{
  action: Action | null
}>()
</script>
<template>
  <div v-if="action === null" class="main-mini-unfocused">
    <div class="mini-contents">
      <div class="create-button"  @click="state.focusedAction = null">
        <h3 class="create-text">Create New</h3>
      </div>
    </div>
  </div>
  <div v-else-if="action.name === state.focusedAction?.name" class="main-mini-focused">
    <div class="mini-contents">
      <div class="title-button">
        <h3 class="title-h3">{{ action.name }}</h3>
      </div>
      <div class="delete-button" @click="state.removeAction(action)">
        <h3 class="delete-text">Delete</h3>
      </div>
    </div>
  </div>
  <div v-else class="main-mini-unfocused">
    <div class="mini-contents">
      <div class="title-button" @click="state.focusedAction = action">
        <h3 class="title-h3">{{ action.name }}</h3>
      </div>
      <div class="delete-button" @click="state.removeAction(action)">
        <h3 class="delete-text">Delete</h3>
      </div>
    </div>
  </div>
</template>
<style scoped>
.main-mini-unfocused {
  background-color: var(--background);
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 17px;
  border-radius: 7px;
}
.main-mini-focused {
  background-color: var(--secondary);
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 17px;
  border-radius: 7px;
}
.mini-contents {
  display: flex;
  flex-direction: row;
  margin-left: 1%;
  margin-right: 1%;
}
.title-h3 {
  color: var(--text);
  font-size: 20px;
}
.title-button {
  width: 80%;
  height: 100%;
  cursor: pointer;
}
.delete-text {
  color: var(--danger);
  border: 0px;
  font-size: 20px;
  text-align: center;
}
.delete-button {
  width: 20%;
  height: 100%;
  cursor: pointer;
  border-left: 1px dashed var(--danger);
}
.create-text {
  border: 0px;
  font-size: 20px;
  text-align: center;
  color: var(--text);
}
.create-button{
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>
