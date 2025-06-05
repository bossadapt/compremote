<script setup lang="ts">
import type { Action } from '../../helpers/sharedInterfaces'

defineProps<{
  focusedAction: Action | null
}>()
</script>

<template>
  <div class="focus-main-container">
    <div v-if="focusedAction!==null" class="focus-main-header">
      <h1 class="focus-main-header-text">Focused Action Name...</h1>
      <button class="save-button">Save</button>
    </div>
    <div v-else>
        <h1 class="focus-main-header-text">Create New Action</h1>
    </div>
    <div class="focus-hr"></div>
    <div v-if="focusedAction!==null">
      
    </div>
</div>
</template>

<style scoped>
.focus-main-container {
  width: 65%;
  width: 100%;
}
.focus-main-header{
  display: flex;
  flex-direction: row;
}
.focus-main-header-text {
  color: var(--primary);
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  font-size: 64px;
  margin-bottom: 0px;
  margin-top: 1%;

}
.save-button{
  cursor: pointer;
  width: 10%;
  background-color: var(--secondary);
  border: 0px;
  font-size: 20px;
  color: var(--primary);
}
.focus-hr{
  height: 9px;
  width: 100%;
  background-image: linear-gradient(to right, var(--primary),5%,var(--secondary));
}
</style>
