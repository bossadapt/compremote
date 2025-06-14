<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import { ref } from 'vue';

let state = useMacroBuilderStore()
let newName = ref(state.focusedAction?.name||'')
</script>
<template>
    <h1>Rename Focused Action</h1>
    <h3>New Name:</h3>
    <input type="text" v-model="newName" />
    <div>
      <button class="save-button" @click="state.renameFocused(newName)">Save</button>
      <button class="cancel-button" @click="state.modalContent = ''">Cancel</button>
    </div>
</template>
<style scoped>
h3{
    margin: 0px;
    font-size: 20px;
}
input{
    margin-top: 0px;
    margin-bottom: 40px;
    font-size: 20px;
}
button {
  height: 4rem;
  font-size: 20px;
  background-color: var(--background);
  color: var(--primary);
  width: 50%;
}
.save-button {
  margin-right: auto;
}
.cancel-button {
  margin-left: auto;
}
</style>
