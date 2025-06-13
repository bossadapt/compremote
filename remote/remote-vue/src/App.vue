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
  await getActions()
  console.log(warningMessage.value)
  if (warningMessage.value === null) {
    loggedIn.value = true
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
  await fetch(hostname + '/actions', {
    credentials: 'include',
  }).then(async (res) => {
    if (res.status === 401) {
      loggedIn.value = false
      createWarningMessage('Backend no longer active')
    } else if (res.status === 500) {
      createWarningMessage('unable to play requested play')
    } else {
      actions.value = await unwrapApiResponse(res)
    }
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
  fetch(hostname + '/play/' + action, {
    credentials: 'include',
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
    <ActionList v-else :play-function="attemptPlay" :actions="actions" :get-actions-function="getActions"></ActionList>
</template>

<style>

*{
    color: white;
}
input{
    color: black;
}
body{
    padding: 0px;
    background-color: black;
}
.main-app{
    padding-left: 0;
    padding-right: 0;
    margin: 0px;
    width: 100vw;
}
button{
    background-color: black;
    color: white;
    cursor: pointer;
}
</style>
