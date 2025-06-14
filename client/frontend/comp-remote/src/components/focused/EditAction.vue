<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import AddEvent from './editComponents/AddEvent.vue'
import EditEntryContainer from './editComponents/EditEntryContainer.vue'
import draggable from 'vuedraggable'
import { TypeEnum } from '@/helpers/sharedInterfaces'
let state = useMacroBuilderStore()
</script>
<template>
  <div class="edit-list-container">
  <AddEvent :idx="0" :type-param="TypeEnum.TextEvent" style="margin-top: 2%; margin-left: 5%; margin-right: 2%"></AddEvent>
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
.edit-list-container{
  max-height: 100%;
  overflow-y: scroll;
}
</style>
