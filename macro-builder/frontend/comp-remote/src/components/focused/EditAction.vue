<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import AddEvent from './editComponents/AddEvent.vue'
import EditEntryContainer from './editComponents/EditEntryContainer.vue'
import draggable from 'vuedraggable'
import { TypeEnum } from '@/helpers/sharedInterfaces'
let state = useStateStore()
</script>
<template>
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
</template>
