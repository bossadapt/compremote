import { ref, toRaw, type Ref } from 'vue'
import { defineStore } from 'pinia'
import {
  ToggleStatus,
  TypeEnum,
  KeyEvent,
  MouseButtonEvent,
  MouseMoveEvent,
  MouseScrollEvent,
  TextEvent,
  BrowserEvent,
  ClickEvent,
  WaitEvent,
  TerminalEvent,
} from '@/helpers/sharedInterfaces'
import type { Action, EventUnion, Variable } from '@/helpers/sharedInterfaces'
import isValidFilename from 'valid-filename'
export const useMacroBuilderStore = defineStore('macroBuilder', () => {
  const HOSTNAME_FOR_BACKEND = 'http://localhost:3334'
  const warningMessage: Ref<string | null> = ref(null)
  const actions: Ref<Action[]> = ref([])
  const isWaitingForInput: Ref<boolean> = ref(false)
  const waitingForInputText: Ref<string> = ref('')
  const isInitializing: Ref<boolean> = ref(true)
  const focusedAction: Ref<Action | null> = ref(null)
  const modalContent: Ref<string> = ref('')
  async function createActionByRecording(name: string) {
    if (!isValidFilename(name)) {
      createWarningMessage('unable to start, name attempted is an invalid filename(windows/linux)')
    } else {
      isWaitingForInput.value = true
      waitingForInputText.value = 'RECORDING IN PROCESS(Press Escape to Finish Recording)'
      try {
        let response = await fetch(HOSTNAME_FOR_BACKEND + '/record')
        if (!response.ok) {
          createWarningMessage('failed to pull reach backend to record')
          throw new Error(`response status: ${response.status}`)
        }
        let newAction: Action = { name, variables: [], events: await response.json() }
        console.log(newAction.events)
        addAction(newAction)
      } catch (error) {
        createWarningMessage('error deserializing record data')
        console.error(error)
      }
      isWaitingForInput.value = false
    }
  }

  async function syncActions(count: number) {
    try {
      let response = await fetch(HOSTNAME_FOR_BACKEND + '/actions')
      if (!response.ok) {
        createWarningMessage('failed to pull actions from backend')
        throw new Error(`response status: ${response.status}`)
      }
      const json: Action[] = await response.json()
      actions.value = json
    } catch (error) {
      createWarningMessage(
        'failed to grab initial state from backend(' + count + '), Trying again in 1 sec',
      )
      sleep(1000)
      syncActions(count++)
      console.error(error)
    }
    isInitializing.value = false
  }

  function addAction(newAction: Action) {
    let newName: string = newAction.name.trim()
    if (!isValidFilename(newName)) {
      createWarningMessage('unable to save, name attempted is an invalid filename(windows/linux)')
    } else if (
      actions.value.find((curAction) => {
        return curAction.name === newAction.name
      }) !== undefined
    ) {
      createWarningMessage('unable to save, this name already exists')
    } else {
      saveAction(newAction, true)
    }
  }
  function copyAction(existingAction: Action) {
    let newName = existingAction.name + '_copy'
    console.log('copy action called:' + newName)
    if (isValidFilename(newName)) {
      addAction({
        name: newName,
        variables: structuredClone(toRaw(existingAction.variables)),
        events: structuredClone(toRaw(existingAction.events)),
      })
    } else {
      createWarningMessage(
        'unable to copy, name length likely too long or previous name was faulty',
      )
    }
  }
  function removeAction(removedAction: Action) {
    fetch(HOSTNAME_FOR_BACKEND + '/actions/remove/', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: removedAction.name }),
    }).then((req) => {
      if (!req.ok) {
        createWarningMessage('Failed to delete action to computer')
      }
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
  ///Returns true if can be converted to number
  function input2number(obj: any, key: string, defaultValue?: number, lowerBound?: number) {
    if (obj[key] === '') {
      obj[key] = defaultValue
    } else {
      try {
        obj[key] = Number(obj[key])
        if (lowerBound && obj[key] < lowerBound) {
          return false
        }
      } catch (error) {
        return false
      }
    }
    return true
  }
  ///needed to use any type to correct the string version of int values
  function validateEventValues(events: any[]) {
    console.log('validation of events called')
    for (let i = 0; i < events.length; i++) {
      let current = events[i]
      console.log(current)

      switch (current.type) {
        case TypeEnum.MouseScrollEvent: {
          if (!input2number(current, 'horizontal_direction', 0)) {
            createWarningMessage(
              'Invalid Horizontal input for scroll event(event #' + (i + 1) + ')',
            )
            return false
          }
          if (!input2number(current, 'vertical_direction', 0)) {
            createWarningMessage('Invalid Vertical input for scroll event(event #' + (i + 1) + ')')
            return false
          }
          break
        }
        case TypeEnum.WaitEvent: {
          if (!input2number(current, 'time', 0, 0)) {
            createWarningMessage('Invalid Time for wait event(event #' + (i + 1) + ')')
            return false
          }
          break
        }
        case TypeEnum.ClickEvent: {
          if (!input2number(current, 'clickCount', 1, 1)) {
            createWarningMessage('Invalid Click Count for click event(event #' + (i + 1) + ')')
            return false
          }
          break
        }
      }
    }
    return true
  }
  function validateVariables(variables: Variable[]) {
    //TODO: add validation on default values if need be
    console.log('validate variables called')
    let variablesSet = new Set<string>()
    for (let i = 0; i < variables.length; i++) {
      let current = variables[i].name.trim()
      variables[i].name = current
      console.log(current)
      if (current !== '' && /^[A-Za-z0-9\s]+$/.test(current)) {
        if (!variablesSet.has(current)) {
          variablesSet.add(current)
        } else {
          createWarningMessage('Duplicate Variable Names not allowed')
          return false
        }
      } else {
        createWarningMessage('Variable name invalid, either empty or contains special characters')
        return false
      }
    }
    return true
  }
  function saveAction(action2save: Action, isNew: boolean) {
    if (
      !isNew &&
      (!validateVariables(action2save.variables) || !validateEventValues(action2save.events))
    ) {
      console.log('validation failed')
      return
    }

    fetch(HOSTNAME_FOR_BACKEND + '/actions/save/', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(action2save),
    }).then((req) => {
      if (!req.ok) {
        createWarningMessage('Failed to save action to computer')
      } else {
        if (isNew) {
          actions.value.push(action2save)
          focusedAction.value = action2save
        }
      }
    })
  }
  ///gets a key from the user and sets the event idx keypressed event and swap the key with the one given
  async function getKey(idx: number) {
    waitingForInputText.value = 'Waiting for key(Press any key to record to event)'
    isWaitingForInput.value = true
    console.log('waiting for key')
    try {
      await fetch(HOSTNAME_FOR_BACKEND + '/getKey').then(async (req) => {
        if (req.ok) {
          let data = await req.json()
          if (focusedAction.value?.events[idx].type === TypeEnum.KeyEvent) {
            ;(focusedAction.value.events[idx] as KeyEvent).key = data.key
          }
        } else {
          createWarningMessage('Failed to get key from backend')
        }
      })
    } catch (error) {
      console.log(error)
      createWarningMessage('Failed to get key from backend')
    }
    console.log('got the key')
    isWaitingForInput.value = false
  }
  async function getButton(idx: number) {
    isWaitingForInput.value = true
    waitingForInputText.value =
      'Waiting for mouse button event to attach to event(press mouse button needed)'
    try {
      await fetch(HOSTNAME_FOR_BACKEND + '/getButton').then(async (req) => {
        if (req.ok) {
          let data = await req.json()
          if (focusedAction.value?.events[idx]) {
            ;(focusedAction.value.events[idx] as any).button = data.button
          }
        } else {
          createWarningMessage('Failed to get button from backend')
        }
      })
    } catch (error) {
      console.log(error)
      createWarningMessage('Failed to get button from backend')
    }
    isWaitingForInput.value = false
  }
  async function getCord(idx: number) {
    isWaitingForInput.value = true
    waitingForInputText.value =
      'Waiting for cord(press left mouse button to record position for event)'

    console.log('waiting for cord')
    try {
      await fetch(HOSTNAME_FOR_BACKEND + '/getCord').then(async (req) => {
        if (req.ok) {
          let data = await req.json()
          if (focusedAction.value?.events[idx]) {
            ;(focusedAction.value.events[idx] as any).x = data.x
            ;(focusedAction.value.events[idx] as any).y = data.y
          }
        } else {
          createWarningMessage('Failed to get cord from backend')
        }
      })
    } catch (error) {
      console.log(error)
      createWarningMessage('Failed to get cord from backend')
    }
    console.log('got the cord')
    isWaitingForInput.value = false
  }

  function addEvent(idx: number, type: TypeEnum) {
    let newEntry: EventUnion
    let generatedId = 'id' + Math.random().toString(16).slice(2)
    switch (type) {
      case TypeEnum.KeyEvent:
        newEntry = new KeyEvent(generatedId)
        break
      case TypeEnum.MouseButtonEvent:
        newEntry = new MouseButtonEvent(generatedId)
        break
      case TypeEnum.MouseMoveEvent:
        newEntry = new MouseMoveEvent(generatedId)
        break
      case TypeEnum.MouseScrollEvent:
        newEntry = new MouseScrollEvent(generatedId)
        break
      case TypeEnum.TextEvent:
        newEntry = new TextEvent(generatedId)
        break
      case TypeEnum.BrowserEvent:
        newEntry = new BrowserEvent(generatedId)
        break
      case TypeEnum.ClickEvent:
        newEntry = new ClickEvent(generatedId)
        break
      case TypeEnum.WaitEvent:
        newEntry = new WaitEvent(generatedId)
        break
      case TypeEnum.TerminalEvent:
        newEntry = new TerminalEvent(generatedId)
        break
      case TypeEnum.Clone:
        const prev = focusedAction.value?.events[idx - 1]
        if (prev != undefined) {
          let temp: EventUnion = { ...prev }
          temp.id = generatedId
          newEntry = temp
        } else {
          createWarningMessage('cannot create clone off of nothing')
          return
        }
    }
    focusedAction.value?.events.splice(idx, 0, newEntry)
  }
  function removeEvent(idx: number) {
    focusedAction.value?.events.splice(idx, 1)
  }
  function renameFocused(newName: string) {
    if (focusedAction.value !== null && isValidFilename(newName)) {
      fetch(HOSTNAME_FOR_BACKEND + '/actions/rename/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ old: focusedAction.value.name, new: newName }),
      }).then((req) => {
        if (!req.ok) {
          createWarningMessage('Failed to rename acition')
        } else {
          //closes the popup
          modalContent.value = ''
          focusedAction.value!.name = newName
        }
      })
    } else {
      createWarningMessage('new name is invalid or focused action is not available')
    }
  }
  async function playFocused() {
    console.log('Play focused called')
    if (focusedAction.value != null) {
      console.log('focused was not null')
      await fetch(HOSTNAME_FOR_BACKEND + '/actions/play/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: focusedAction.value.name }),
      }).then((req) => {
        if (!req.ok) {
          console.log('backend failed')
          console.log(req)
          createWarningMessage('Failed to play from backend')
        } else {
          console.log('fetch resolved')
        }
      })
    } else {
      console.trace()
      createWarningMessage('cannot play when there is no focus')
    }
  }
  return {
    actions,
    isWaitingForInput,
    waitingForInputText,
    isInitializing,
    focusedAction,
    warningMessage,
    modalContent,
    copyAction,
    renameFocused,
    syncActions,
    createWarningMessage,
    createActionByRecording,
    addAction,
    removeAction,
    addEvent,
    removeEvent,
    saveAction,
    playFocused,
    getKey,
    getCord,
    getButton,
  }
})
