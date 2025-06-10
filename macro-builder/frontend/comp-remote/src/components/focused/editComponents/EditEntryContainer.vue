<script setup lang="ts">
import { ref } from 'vue'
import { TypeEnum } from '../../../helpers/sharedInterfaces'
import type {
  EventUnion,
  KeyboardEvent,
  MouseButtonEvent,
  MouseMoveEvent,
  MouseScrollEvent,
  WaitEvent,
} from '../../../helpers/sharedInterfaces'
import KeyboardEventInner from './inners/KeyboardEventInner.vue'
import MouseButtonEventInner from './inners/MouseButtonEventInner.vue'
import MouseMoveEventInner from './inners/MouseMoveEventInner.vue'
import MouseScrollEventInner from './inners/MouseScrollEventInner.vue'
import WaitEventInner from './inners/WaitEventInner.vue'
import { useStateStore } from '@/stores/state'
import AddEvent from './AddEvent.vue'
const state = useStateStore()
defineProps<{
  event: EventUnion
  idx: number
}>()
</script>
<template>
  <div class="main">
    <div class="main-edit-container">
      <i class="handle">☰</i>
      <div class="contents">
        <KeyboardEventInner
          v-if="event.type === TypeEnum.KeyboardEvent"
          :event="event as KeyboardEvent"
          :idx="idx"
        ></KeyboardEventInner>
        <MouseButtonEventInner
          v-if="event.type === TypeEnum.MouseButtonEvent"
          :event="event as MouseButtonEvent"
          :idx="idx"
        ></MouseButtonEventInner>
        <MouseMoveEventInner
          v-if="event.type === TypeEnum.MouseMoveEvent"
          :event="event as MouseMoveEvent"
          :idx="idx"
        ></MouseMoveEventInner>
        <MouseScrollEventInner
          v-if="event.type === TypeEnum.MouseScrollEvent"
          :event="event as MouseScrollEvent"
          :idx="idx"
        ></MouseScrollEventInner>
        <WaitEventInner
          v-if="event.type === TypeEnum.WaitEvent"
          :event="event as WaitEvent"
        ></WaitEventInner>
      </div>

      <button @click="state.removeEvent(idx)" class="remove">❌</button>
    </div>
    <AddEvent :idx="idx + 1" :type-param="event.type"></AddEvent>
  </div>
</template>
<style>
.inner {
  display: flex;
  flex-direction: row;
}
.section {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: center;

}
</style>
<style scoped>
.contents {
  width: 90%;
  justify-content: center;
}
.handle {
  font-family:
    'Segoe UI Symbol', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji',
    'Noto Color Emoji', 'monospace';
  margin-right: auto;
  cursor: grab;
  user-select: none;
  color: white;
  width: 5%;
  height: 100%;
  font-size: 40px;
}
.remove {
  font-size: 40px;
  width: 5%;
  background-color: var(--secondary);
  border: 0px;
  color: var(--danger);
  cursor: pointer;
}
.main {
  display: flex;
  flex-direction: column;
  margin-left: 2%;
  margin-right: 2%;
  background-color: var(--secondary);
  border-radius: 18px;
  margin-top: 1%;
}
.main-edit-container {
  width: 96%;
  display: flex;
  flex-direction: row;
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 0.5%;
  margin-bottom: 0.5%;
  justify-content: center;
  align-items: center;
}
</style>
