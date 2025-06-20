<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import EditEntryContainer from './editComponents/EditEntryContainer.vue'
import draggable from 'vuedraggable'
import VariablesContainer from './editComponents/VariablesContainer.vue'
let state = useMacroBuilderStore()


</script>
<template>
  <div class="focus-main-header">
    <h1
      class="focus-main-header-text"
      style="cursor: pointer"
      @click="state.modalContent = 'renameFocused'"
    >
      {{ state.focusedAction!.name }}
    </h1>
    <!-- for some reason this needs to be a div or play focused gets called 13 times, blame vue -->
    <div
      class="save-button"
      type="button"
      @click="state.playFocused()"
      style="background-color: var(--primary); color: var(--secondary)"
    >
      Play Saved Version
    </div>
    <button class="save-button" @click="state.saveAction(state.focusedAction!, false)">Save</button>
  </div>
  <div class="focus-hr"></div>
  <div class="edit-list-container">
    <ul>
      <VariablesContainer />
    </ul>
    <draggable
      v-if="state.focusedAction && state.focusedAction.events"
      tag="ul"
      item-key="id"
      :list="state.focusedAction!.events"
      handle=".handle"
    >
      <template #item="{ element, index }">
        <li :key="element.id">
          <EditEntryContainer :event="element" :idx="index" />
        </li>
      </template>
    </draggable>
  </div>
</template>
<style>
.save-button {
  cursor: pointer;
  flex: 0 0 10%;
  background-color: var(--secondary);
  border: 0px;
  font-size: 20px;
  color: var(--primary);
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.edit-list-container {
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0;
}
</style>
