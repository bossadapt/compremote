<script setup lang="ts">
import type { Action,MouseEvent,KeyboardEvent } from '@/helpers/sharedInterfaces'
import { useStateStore } from '@/stores/state';
let state = useStateStore()
</script>
<template>
  <li style="display: flex; flex-direction: row" v-for="event in state.focusedAction!.events">
    <!-- for mouse events-->
    <div v-if="'button' in event">
    </div>
        <!-- for keyboard events-->
    <div v-else></div>
</li>
</template>
<style></style>
