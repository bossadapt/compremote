<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import AddEvent from './helpers/AddEvent.vue'
import { TypeEnum, Variable } from '@/helpers/sharedInterfaces'
const state = useMacroBuilderStore()
</script>
<template>
    <div class="main">
      <div class="main-edit-container">
          <div class="section">
            <h3>Variable Names to prompt user:</h3>
            <div>
            <table>
              <thead>
                <tr>
                <th>Variable Name</th>
                <th>Default Value</th>
                <th>DEL</th>
                </tr>
              </thead>
              <tbody>
              <tr
                v-for="(_variable, index) in state.focusedAction!.variables"
              >
                <td><input class="table-input" type="text" v-model="state.focusedAction!.variables[index].name" /></td>
                <td><input class="table-input" type="text" v-model="state.focusedAction!.variables[index].value" /></td>
                <td><button class="delete-var-button" @click="state.focusedAction!.variables.splice(index, 1)">❌</button></td>
            </tr>
            </tbody>
          </table>

            <button
            class="add-var-button"
              @click="
                state.focusedAction?.variables.push(new Variable())
              "
            >
              Add Variable
            </button>
          </div>

          </div>
        </div>
      <AddEvent :idx="0" :type-param="TypeEnum.TextEvent" style="margin-top: 2%" />
    </div>
</template>
<style scoped>
.add-var-button{
  border: white 1px;
  color: var(--text);
  background-color: var(--secondary);
  border-style: groove;
  width: 100%;
}
.delete-var-button{
  color: var(--danger);
  background-color: var(--background);
  width: 100%;
  height: 100%;
  border: 0px;
}
.table-input{
  width:95%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.section{
  width: 100%;
  display: flex;
  flex-direction: row;

}
.variables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Adjust as needed */
  gap: 0.5rem;
}
.variable-container {
  max-width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.variable-container {
  display: flex;
  align-items: center;
  max-width: 100%;
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
  margin-left: 5%;
  margin-right: 2%;
  background-color: var(--secondary);
  border-radius: 18px;
  margin-top: 1%;
}
.main-edit-container {
  max-width: 96%;
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
