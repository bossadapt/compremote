<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { ref, type Ref } from 'vue'
const state = useStateStore()
</script>
<template>
  <div v-if="state.focusedAction !== null" class="modal">
    <div class="modal-content">
      <h2>Choose Variables</h2>
      <div v-for="varr in state.focusedAction.variables">
        <h4>{{ varr.name }}</h4>
        <input type="text" v-model="varr.value" />
      </div>
      <div>
        <button class="content-buttons" @click="state.focusedAction = null">Cancel</button>
        <button class="content-buttons" @click="state.play(state.focusedAction)">Play</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* The Modal (background) */
.modal {
  display: block;
  position: fixed;
  z-index: 3;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

/* Modal Content/Box */
.modal-content {
  display: flex;
  flex-direction: column;
  background-color: black;
  color: white;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 40%;
}
.content-buttons {
  width: 50%;
  background-color: black;
  color: white;
}
</style>
