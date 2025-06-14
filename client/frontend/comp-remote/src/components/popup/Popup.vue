<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder';
import RenameFocused from './popupContents/RenameFocused.vue';

let state = useMacroBuilderStore()
</script>
<template>
<div v-if="state.modalContent !==''"  class="modal">
  <div class="modal-content">
    <RenameFocused v-if="state.modalContent==='renameFocused'"/>
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
  background-color: rgb(0,0,0); 
  background-color: rgba(0,0,0,0.4); 
}

/* Modal Content/Box */
.modal-content {
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  color: var(--primary);
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 40%; 
}
</style>
