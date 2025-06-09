import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { ToggleStatus, TypeEnum } from '@/helpers/sharedInterfaces'
import type {
  Action,
  EventUnion,
  KeyboardEvent as MyKeyboardEvent,
} from '@/helpers/sharedInterfaces'
import isValidFilename from 'valid-filename'
export const useStateStore = defineStore('state', () => {
  const warningMessage: Ref<string | null> = ref(null)
  const actions: Ref<Action[]> = ref([])
  const isRecording: Ref<boolean> = ref(false)
  const isInitializing: Ref<boolean> = ref(true)
  const focusedAction: Ref<Action | null> = ref(null)

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
        let newAction: Action = { name, events: await response.json() }
        console.log(newAction.events)
        addAction(newAction)
      } catch (error) {
        createWarningMessage('error deserializing record data')
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
      saveAction(newAction)
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
  function saveAction(action2save: Action) {
    //TODO: maybe run checks for valid input if you ask the user to press all the keys on thier keyboard on first boot
    fetch('http://localhost:3334/actions/save/' + action2save.name, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action2save.events),
    }).then((req) => {
      if (!req.ok) {
        createWarningMessage('Failed to save action to computer')
      }
    })
  }
  //FOR specific focused action editing

  function addEvent(idx: number, type: TypeEnum) {
    let newEntry: EventUnion
    switch (type) {
      case TypeEnum.KeyboardEvent:
        newEntry = { type: TypeEnum.KeyboardEvent, toggle: ToggleStatus.PRESSED, key: 'Key.space' }
        break
      case TypeEnum.MouseButtonEvent:
        newEntry = {
          type: TypeEnum.MouseButtonEvent,
          toggle: ToggleStatus.RELEASED,
          button: 'button.Left',
          x: 0,
          y: 0,
        }
        break
      case TypeEnum.MouseMoveEvent:
        newEntry = { type: TypeEnum.MouseMoveEvent, x: 0, y: 0 }
        break
      case TypeEnum.MouseScrollEvent:
        newEntry = {
          type: TypeEnum.MouseScrollEvent,
          vertical_direction: 0,
          horizontal_direction: 0,
          x: 0,
          y: 0,
        }
        break

      case TypeEnum.WaitEvent:
        newEntry = { type: TypeEnum.WaitEvent, time: 0 }
        break
    }
    focusedAction.value?.events.splice(idx, 0, newEntry)
  }
  function removeEvent(idx: number) {
    focusedAction.value?.events.splice(idx, 1)
  }
  function playFocused() {
    console.log('Play focused called')
    if (focusedAction.value != null) {
      console.log('focused was not null')
      fetch('http://localhost:3334/actions/play/' + focusedAction.value.name).then((req) => {
        if (!req.ok) {
          createWarningMessage('Failed to play from backend')
        }
      })
    } else {
      createWarningMessage('cannot play when there is no focus')
    }
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
    addEvent,
    removeEvent,
    saveAction,
    playFocused,
  }
})
