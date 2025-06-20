<script setup lang="ts">
import { useStateStore } from '@/stores/state'
import { ref, type Ref } from 'vue'
import { VariableEnum } from '../../../../client/frontend/comp-remote/src/helpers/sharedInterfaces';
const state = useStateStore()
</script>
<template>
  <div v-if="state.focusedAction !== null" class="modal">
    <div class="modal-content">
      <h2>Choose Variables</h2>
      <div class="var-container" v-for="varr in state.focusedAction.variables">
        <h2 class="var-title">{{ varr.name }}</h2>
        <input v-if="varr.type===VariableEnum.RawText" class="var-input" type="text" v-model="varr.value" />
        <select v-else class="var-input" type="text" v-model="varr.value">
          <option v-for="option in varr.options" :value="option">{{ option }}</option>
        </select>

      </div>
      <div class="popup-button-container">
        <button class="content-buttons" @click="state.focusedAction = null">Cancel</button>
        <button class="content-buttons" @click="state.play(state.focusedAction)">Play</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
select{
  color: black;
}
.var-container{
 width: 100%;
 margin-bottom: 10px;
 margin-top: 0px;
}
.var-title{
  margin-top: 0px;
  margin-bottom: 0px;
}
.var-input{
width: 100%;
}
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
  justify-content: center;
  align-items: center;
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
.popup-button-container{
  width: 100%;
}
</style>
