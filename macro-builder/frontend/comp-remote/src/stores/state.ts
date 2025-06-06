import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Action } from '@/helpers/sharedInterfaces'
import isValidFilename from 'valid-filename'
export const useStateStore = defineStore('state', () => {
  const warningMessage: Ref<string | null> = ref(null)
  const actions: Ref<Action[]> = ref([])
  const isRecording: Ref<boolean> = ref(false)
  const isInitializing: Ref<boolean> = ref(true)
  const focusedAction: Ref<Action | null> = ref(null)

  //TODO: create a recording pipline using isrecording changing app.vue
  async function createActionByRecording(name: string) {
    if (!isValidFilename(name)) {
      createWarningMessage('unable to start, name attempted is an invalid filename(windows/linux)')
    } else {
      isRecording.value = true
      try {
        let response = await fetch('http://localhost:3334/record')
        if (!response.ok) {
          createWarningMessage('failed to pull reach backend to record')
          throw new Error(`response status: ${response.status}`)
        }
        let newAction: Action = { name, events: [] }
        //console.log(response.json())
        newAction.events = await response.json()
        addAction(newAction)
      } catch (error) {
        createWarningMessage('error deserializing data')
        console.error(error)
      }
      isRecording.value = false
    }
  }
  async function syncActions() {
    let response = await fetch('http://localhost:3334/actions')
    try {
      if (!response.ok) {
        createWarningMessage('failed to pull actions from backend')
        throw new Error(`response status: ${response.status}`)
      }
      const json: Action[] = await response.json()
      actions.value = json
    } catch (error) {
      createWarningMessage('error deserializing data')
      console.error(error)
    }
    isInitializing.value = false
  }
  function addAction(newAction: Action) {
    console.log('add action called')
    let newName: string = newAction.name.trim()
    console.log(newAction.name)
    if (!isValidFilename(newName)) {
      createWarningMessage('unable to save, name attempted is an invalid filename(windows/linux)')
    } else if (
      actions.value.find((curAction) => {
        return curAction.name === newAction.name
      }) !== undefined
    ) {
      createWarningMessage('unable to save, this name already exists')
    } else {
      fetch('http://localhost:3334/actions/save/' + newAction.name, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAction.events),
      })
      actions.value.push(newAction)
      focusedAction.value = newAction
    }
  }
  function removeAction(removedAction: Action) {
    fetch('http://localhost:3334/actions/remove/' + removedAction.name, {
      method: 'DELETE',
    })
    actions.value = actions.value.filter((curAction) => {
      return curAction.name !== removedAction.name
    })
    if (focusedAction.value === removedAction) {
      focusedAction.value = null
    }
  }
  async function createWarningMessage(message: string) {
    warningMessage.value = message
    sleep(8000).then(() => {
      //so that we dont overwrite another message
      if (warningMessage.value === message) {
        warningMessage.value = null
      }
    })
  }
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  return {
    actions,
    isRecording,
    isInitializing,
    focusedAction,
    warningMessage,
    syncActions,
    createWarningMessage,
    createActionByRecording,
    addAction,
    removeAction,
  }
})
