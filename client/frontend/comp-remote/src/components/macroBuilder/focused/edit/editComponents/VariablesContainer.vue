<script setup lang="ts">
import { useMacroBuilderStore } from '@/stores/macroBuilder'
import AddEvent from './helpers/AddEvent.vue'
import { TypeEnum, Variable, VariableEnum } from '@/helpers/sharedInterfaces'
const state = useMacroBuilderStore()

function onTypeChange(index: number) {
  const variable = state.focusedAction!.variables[index]
  if (variable.type === VariableEnum.EnumText) {
    variable.options = [variable.value]
  } else if (variable.type === VariableEnum.RawText) {
    variable.options = undefined
  }
}

function addEnumOption(index: number) {
  const variable = state.focusedAction!.variables[index]
  if (variable.options) {
    variable.options.push('')
  } else {
    variable.options = ['']
  }
}

function removeEnumOption(index: number, enumIndex: number) {
  const variable = state.focusedAction!.variables[index]
  if (!variable.options || variable.options.length < 2) {
    state.createWarningMessage('Cannot have < 1 option')
    return
  }
  if (variable.options) {
    variable.options.splice(enumIndex, 1)
  }
}
  async function copy2clipboard(mytext:string) {
    try {
      await navigator.clipboard.writeText("#:"+mytext+":")
      alert('Copied')
    } catch ($e) {
      alert('Cannot copy')
    }
  }
</script>
<template>
  <div class="main">
    <div class="main-edit-container">
      <div class="section" style="margin-top: 10px;">
        <div>
          <table>
            <thead>
              <tr>
                <th>Copy</th>
                <th>Variable Name</th>
                <th>Type</th>
                <th>Default Value(s)</th>
                <th>DEL</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(variable, index) in state.focusedAction!.variables">
                <td>
                  <button style="width: 100%" @click="copy2clipboard(variable.name)">Clip</button>
                </td>
                <td>
                  <input
                    class="table-input"
                    type="text"
                    v-model="state.focusedAction!.variables[index].name"
                  />
                </td>
                <td>
                  <select
                    class="type-drop"
                    v-model="state.focusedAction!.variables[index].type"
                    @change="onTypeChange(index)"
                  >
                    <option :value="VariableEnum.RawText">Raw Text</option>
                    <option :value="VariableEnum.EnumText">Enum</option>
                  </select>
                </td>
                <td v-if="state.focusedAction!.variables[index].type === VariableEnum.RawText">
                  <input
                    class="table-input"
                    type="text"
                    v-model="state.focusedAction!.variables[index].value"
                  />
                </td>
                <td v-else>
                  <div
                    class="enum-container"
                    v-for="(enumOption, enumIndex) in state.focusedAction!.variables[index].options"
                  >
                    <input
                      type="radio"
                      :checked="state.focusedAction!.variables[index].value === enumOption"
                      @change="state.focusedAction!.variables[index].value = enumOption"
                      :key="enumIndex"
                    />
                    <input
                      style="flex-grow: 1"
                      v-model="state.focusedAction!.variables[index].options![enumIndex]"
                      type="text"
                    />
                    <button @click="removeEnumOption(index, enumIndex)">❌</button>
                  </div>
                  <button style="width: 100%" @click="addEnumOption(index)">ADD</button>
                </td>

                <td>
                  <button
                    class="delete-var-button"
                    @click="state.focusedAction!.variables.splice(index, 1)"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <button
            class="add-var-button"
            @click="state.focusedAction?.variables.push(new Variable())"
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
.enum-container {
  display: flex;
  flex-direction: row;
}
table {
  width: 100%;
}
.type-drop {
  width: 100%;
}
.add-var-button {
  border: white 1px;
  color: var(--text);
  background-color: var(--secondary);
  border-style: groove;
  width: 100%;
}
.delete-var-button {
  color: var(--danger);
  background-color: var(--background);
  width: 100%;
  height: 100%;
  border: 0px;
}
.table-input {
  width: 95%;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.section {
  width: 100%;
  display: flex;
  flex-direction: column;
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
