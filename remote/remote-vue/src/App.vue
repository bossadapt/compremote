<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import Login from './components/Login.vue'
import ActionList from './components/ActionList.vue'
import Warning from './components/Warning.vue'
const hostname = 'https://bossadapt.org/remote/api'
const actions: Ref<string[]> = ref([])
const loggedIn = ref(false)
const warningMessage: Ref<string | null> = ref(null)

onMounted(async () => {
  //see if they already have a session token
  let firstAttemptToSync = await getActions()
  console.log('firstattempt:' + firstAttemptToSync)
  if (firstAttemptToSync) {
    console.log('logged in')
    loggedIn.value = true
  } else {
    console.log('tried to log them in the ol fashion way')
    let urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('roomKey')) {
      console.log('tried to log them in the ol fashion way p2')
      attemptLogIn(urlParams.get('roomKey')!)
    }
  }
})
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
function attemptPlay(action: string) {
  fetch(hostname + '/play', {
    credentials: 'include',
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: action }),
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
}
</script>

<template>
  <Warning :warning-message="warningMessage"></Warning>
  <Login v-if="loggedIn === false" :attempt-log-in="attemptLogIn"></Login>
  <ActionList
    v-else
    :play-function="attemptPlay"
    :actions="actions"
    :get-actions-function="getActions"
  ></ActionList>
</template>

<style>
* {
  color: white;
}
button {
  cursor: pointer;
}
input {
  color: black;
}
body {
  padding: 0px;
  background-color: black;
}
.main-app {
  padding-left: 0;
  padding-right: 0;
  margin: 0px;
  width: 100vw;
}
button {
  background-color: black;
  color: white;
}
</style>
