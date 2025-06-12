<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

const hostname = 'http://localhost:3212'
const roomKey: Ref<string> = ref('')
const actions: Ref<string[]> = ref([])
const loggedIn = ref(false)
const warningMessage: Ref<string | null> = ref('')

onMounted(async()=>{
    //see if they already have a session token
    await getActions()
    if(warningMessage===null){
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
async function unwrapApiResponse(res:Response){
    let message = await res.json()
    console.log("json parsing:"+ message.toString())
    console.log("json parsing:"+ message.message.toString())
    return JSON.parse(message.message)
}
async function getActions() {
  await fetch(hostname + '/actions', {
    credentials: 'include',
  }).then(async (res) => {
    if (res.status !== 200) {
      createWarningMessage('Unable to pull actions from backend')
    } else {
      actions.value =  await unwrapApiResponse(res)
    }
  })
}
function attemptLogIn() {
  if (roomKey.value.length != 10) {
    createWarningMessage('invalid roomKey')
  } else {
    fetch(hostname + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomKey: roomKey.value,
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
    if (res.status !== 200) {
      createWarningMessage('Unable to play specified action')
    }
  })
}
</script>

<template>
  <div v-if="warningMessage !== null">
    <h2>{{ warningMessage }}</h2>
  </div>
  <div v-if="loggedIn === false">
    <h1>Login</h1>
    <input type="text" v-model="roomKey" />
    <button @click="attemptLogIn">Log In</button>
  </div>
  <div v-else>
    <button @click="getActions()">Refresh</button>
    <li v-for="action in actions">
      <button @click="attemptPlay(action)">{{ action }}</button>
    </li>
  </div>
</template>

<style scoped></style>
