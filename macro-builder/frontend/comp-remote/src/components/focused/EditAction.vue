<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import EditEntryContainer from './editComponents/EditEntryContainer.vue'
let state = useStateStore()
</script>
<template>
  <li style="display: flex; flex-direction: column" v-for="event in state.focusedAction!.events">
    <EditEntryContainer :event="event"></EditEntryContainer>
  </li>
</template>
<style></style>
