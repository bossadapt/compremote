import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ref } from 'vue'
import {
  VariableEnum,
  type ClientSideAction,
  type Variable,
} from '@/../../../client/frontend/comp-remote/src/helpers/sharedInterfaces'
export const useStateStore = defineStore('state', () => {
  const hostname = 'https://bossadapt.org/remote/api'
  const actions: Ref<ClientSideAction[]> = ref([])
  const focusedAction: Ref<ClientSideAction | null> = ref(null)
  const loggedIn = ref(false)
  const warningMessage: Ref<string | null> = ref(null)

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
  async function unwrapApiResponse(res: Response) {
    let message = await res.json()
    console.log('json parsing:' + message.toString())
    console.log('json parsing:' + message.message.toString())
    return JSON.parse(message.message)
  }
  async function getActions() {
    return await fetch(hostname + '/actions', {
      credentials: 'include',
    }).then(async (res) => {
      if (res.status === 401) {
        if (loggedIn.value === true) {
          loggedIn.value = false
          createWarningMessage('Backend no longer active')
        }
      } else if (res.status === 500) {
        createWarningMessage('unable to play requested play')
      } else {
        actions.value = await unwrapApiResponse(res)
        console.log(actions)
        return true
      }
      return false
    })
  }
  function attemptLogIn(roomKey: string) {
    if (roomKey.length != 10) {
      createWarningMessage('invalid roomKey')
    } else {
      fetch(hostname + '/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomKey: roomKey,
        }),
        credentials: 'include',
      }).then(async (res) => {
        if (res.status == 200) {
          await getActions()
          loggedIn.value = true
        } else {
          createWarningMessage('Invalid login attempt')
        }
      })
    }
  }

  // function validateVariables(variables: Variable[]) {
  //   for(let i =0; i<variables.length;i++){
  //     const curVar = variables[i]
  //     if(curVar.type === VariableEnum.EnumText){

  //     }
  //   }
  // }
  function play(action: ClientSideAction) {
    fetch(hostname + '/play', {
      credentials: 'include',
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: action }),
    }).then((res) => {
      if (res.status === 401) {
        loggedIn.value = false
        createWarningMessage('Backend is no longer connected')
      } else if (res.status === 500) {
        //assume its because its not there anymore and get the new state
        getActions()
        createWarningMessage('Unable to play specified action, fetching new state of actions')
      } else {
      }
    })
    focusedAction.value = null
  }
  function attemptPlay(action: ClientSideAction) {
    if (action.variables.length > 0) {
      //bring up the popup screen for the variables
      focusedAction.value = action
    } else {
      play(action)
    }
  }
  return {
    play,
    getActions,
    attemptPlay,
    attemptLogIn,
    actions,
    warningMessage,
    focusedAction,
    loggedIn,
  }
})
