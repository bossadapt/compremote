<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import AddEvent from './editComponents/AddEvent.vue'
import EditEntryContainer from './editComponents/EditEntryContainer.vue'
let state = useStateStore()
</script>
<template>
  <!--https://sagalbot.github.io/vue-sortable/ add ul and stuff-->
  <AddEvent :idx="0" style="margin-top: 2%;margin-left: 2%;margin-right: 2%;"></AddEvent>
  <li
    style="display: flex; flex-direction: column"
    v-for="(event, index) in state.focusedAction!.events"
  >
    <EditEntryContainer :event="event" :idx="index"></EditEntryContainer>
  </li>
</template>
<style></style>
