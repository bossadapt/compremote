<script setup lang="ts">
import { VariableEnum, type ActionEvent } from '@/helpers/sharedInterfaces'
import { useMacroBuilderStore } from '@/stores/macroBuilder'
const state = useMacroBuilderStore()
//   action: string = ''
//   variables: Variable[] = []
//   playCount: number = 1

let props = defineProps<{
  event: ActionEvent
}>()
function actionSwap(action: string) {
  let actionSelected = state.actions.find((act) => {
    return act.name === action
  })
  if (actionSelected) {
    props.event.variables = actionSelected.variables
    props.event.playCount = 1
  } else {
    state.createWarningMessage('selected action for action event is invalid')
  }
}
</script>
<template>
  <div class="inner">
    <div class="section">
      <h3>Action:</h3>
      <select v-model="event.action" :onchange="actionSwap(event.action)">
        <option
          v-for="action in state.actions.filter((act) => {
            return act.name !== state.focusedAction!.name
          })"
          :value="action.name"
        >
          {{ action.name }}
        </option>
      </select>
    </div>
    <div v-if="event.action !== ''" class="section">
      <h3>Play Count:</h3>
      <input v-model="event.playCount" type="number" />
    </div>
    <div v-if="event.variables.length > 0" class="section">
      <h3>Variables:</h3>
      <div class ="vars-container">
        <div class ="var-container" v-for="variable in event.variables">
          <h4>{{ variable.name }}</h4>
          <input
            v-if="variable.type === VariableEnum.RawText"
            type="text"
            v-model="variable.value"
          />
          <select v-if="variable.type === VariableEnum.EnumText" v-model="variable.value">
            <option v-for="opt in variable.options" :value="opt">{{ opt }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.vars-container{
  display: flex;
  flex-direction: column;
}
.var-container{
  display: flex;
  flex-direction: row;
}
</style>
