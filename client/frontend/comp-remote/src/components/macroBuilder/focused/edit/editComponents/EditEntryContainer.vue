<script setup lang="ts">
import { TypeEnum } from '../../../../../helpers/sharedInterfaces'
import type {
  BrowserEvent,
  ClickEvent,
  EventUnion,
  KeyEvent,
  MouseButtonEvent,
  MouseMoveEvent,
  MouseScrollEvent,
  RangeMouseMoveEvent,
  TerminalEvent,
  TextEvent,
  WaitEvent,
} from '../../../../../helpers/sharedInterfaces'
import KeyEventInner from './inners/KeyEventInner.vue'
import MouseButtonEventInner from './inners/MouseButtonEventInner.vue'
import MouseMoveEventInner from './inners/MouseMoveEventInner.vue'
import MouseScrollEventInner from './inners/MouseScrollEventInner.vue'
import WaitEventInner from './inners/WaitEventInner.vue'
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import AddEvent from './helpers/AddEvent.vue'
import BrowserEventInner from './inners/BrowserEventInner.vue'
import TextEventInner from './inners/TextEventInner.vue'
import ClickEventInner from './inners/ClickEventInner.vue'
import TerminalEventInner from './inners/TerminalEventInner.vue'
import RangeMouseMoveEventInner from './inners/RangeMouseMoveEventInner.vue'
const state = useMacroBuilderStore()
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
        <KeyEventInner
          v-if="event.type === TypeEnum.KeyEvent"
          :event="event as KeyEvent"
          :idx="idx"
        ></KeyEventInner>
        <MouseButtonEventInner
          v-else-if="event.type === TypeEnum.MouseButtonEvent"
          :event="event as MouseButtonEvent"
          :idx="idx"
        ></MouseButtonEventInner>
        <MouseMoveEventInner
          v-else-if="event.type === TypeEnum.MouseMoveEvent"
          :event="event as MouseMoveEvent"
          :idx="idx"
        ></MouseMoveEventInner>
        <MouseScrollEventInner
          v-else-if="event.type === TypeEnum.MouseScrollEvent"
          :event="event as MouseScrollEvent"
          :idx="idx"
        ></MouseScrollEventInner>
        <WaitEventInner
          v-else-if="event.type === TypeEnum.WaitEvent"
          :event="event as WaitEvent"
        ></WaitEventInner>
        <BrowserEventInner
          v-else-if="event.type === TypeEnum.BrowserEvent"
          :event="event as BrowserEvent"
        ></BrowserEventInner>
        <TextEventInner
          v-else-if="event.type === TypeEnum.TextEvent"
          :event="event as TextEvent"
        ></TextEventInner>
        <ClickEventInner
          v-else-if="event.type === TypeEnum.ClickEvent"
          :event="event as ClickEvent"
          :idx="idx"
        ></ClickEventInner>
        <TerminalEventInner
          v-else-if="event.type === TypeEnum.TerminalEvent"
          :event="event as TerminalEvent"
        ></TerminalEventInner>
        <RangeMouseMoveEventInner
          v-else-if="event.type === TypeEnum.RangeMouseMoveEvent"
          :event="event as RangeMouseMoveEvent"
        ></RangeMouseMoveEventInner>
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
