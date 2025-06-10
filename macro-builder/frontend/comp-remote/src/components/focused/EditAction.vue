<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import AddEvent from './editComponents/AddEvent.vue'
import EditEntryContainer from './editComponents/EditEntryContainer.vue'
import draggable from 'vuedraggable'
let state = useStateStore()
</script>
<template>
  <!--https://sagalbot.github.io/vue-sortable/ add ul and stuff-->
  <AddEvent :idx="0" style="margin-top: 2%;margin-left: 5%;margin-right: 2%;"></AddEvent>
  <draggable v-if="state.focusedAction && state.focusedAction.events" tag="ul" item-key="id" :list="state.focusedAction!.events" handle=".handle">
    <template #item="{element, index}" >
          <li
      style="display: row; flex-direction: column"
      :key="element.id"
    >
      <EditEntryContainer :event="element" :idx="index"></EditEntryContainer>
    </li>
    </template>
  
  </draggable>
</template>
