<script setup lang="ts">
import { TypeEnum } from '../../../helpers/sharedInterfaces'
import type { EventUnion } from '../../../helpers/sharedInterfaces'
import KeyboardEvent from './inners/KeyboardEvent.vue'
import MouseButtonEvent from './inners/MouseButtonEvent.vue'
import MouseMoveEvent from './inners/MouseMoveEvent.vue'
import MouseScrollEvent from './inners/MouseScrollEvent.vue'
import WaitEvent from './inners/WaitEvent.vue'
defineProps<{
  event: EventUnion
}>()
</script>
<template>
  <div class="main">
    <div class="main-edit-container">
      <!-- TODO: Drag button -->
      <KeyboardEvent v-if="event.type === TypeEnum.KeyboardEvent"></KeyboardEvent>
      <MouseButtonEvent v-if="event.type === TypeEnum.MouseButtonEvent"></MouseButtonEvent>
      <MouseMoveEvent v-if="event.type === TypeEnum.MouseMoveEvent"></MouseMoveEvent>
      <MouseScrollEvent v-if="event.type === TypeEnum.MouseScrollEvent"></MouseScrollEvent>
      <WaitEvent v-if="event.type === TypeEnum.WaitEvent"></WaitEvent>
      <!-- TODO: Delete button -->
    </div>
    <div class="main-add-container">
      <!-- TODO: Add new editentrycontainer under button -->
    </div>
  </div>
</template>
<style scoped>
.main{
display: flex;
flex-direction: column;
}
.main-edit-container{

}
.main-add-container{

}
</style>
