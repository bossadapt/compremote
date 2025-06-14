<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import AddEvent from './editComponents/helpers/AddEvent.vue'
import EditEntryContainer from './editComponents/EditEntryContainer.vue'
import draggable from 'vuedraggable'
import { TypeEnum } from '@/helpers/sharedInterfaces'
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
    <button
      class="save-button"
      @click="state.playFocused()"
      style="background-color: var(--primary); color: var(--secondary)"
    >
      Play Saved Version
    </button>
    <button class="save-button" @click="state.saveAction(state.focusedAction!,false)">Save</button>
  </div>
  <div class="focus-hr"></div>
  <div class="edit-list-container">
    <AddEvent
      :idx="0"
      :type-param="TypeEnum.TextEvent"
      style="margin-top: 2%; margin-left: 5%; margin-right: 2%"
    ></AddEvent>
    <draggable
      v-if="state.focusedAction && state.focusedAction.events"
      tag="ul"
      item-key="id"
      :list="state.focusedAction!.events"
      handle=".handle"
    >
      <template #item="{ element, index }">
        <li :key="element.id">
          <EditEntryContainer :event="element" :idx="index"></EditEntryContainer>
        </li>
      </template>
    </draggable>
  </div>
</template>
<style>
.edit-list-container {
  flex: 1 1 0;
  overflow-y: auto;
  min-height: 0; 
}
</style>
