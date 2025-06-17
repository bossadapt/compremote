<script setup lang="ts">
import { onMounted, ref, useTemplateRef, type Ref } from 'vue'
import Login from './components/Login.vue'
import ActionList from './components/ActionList.vue'
import Warning from './components/Warning.vue'
import Popup from './components/Popup.vue'
import { useStateStore } from './stores/state'
const state = useStateStore()
onMounted(async () => {
  //see if they already have a session token
  let firstAttemptToSync = await state.getActions()
  console.log('firstattempt:' + firstAttemptToSync)
  if (firstAttemptToSync) {
    console.log('logged in')
    state.loggedIn = true
  } else {
    console.log('tried to log them in the ol fashion way')
    let urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('roomKey')) {
      console.log('tried to log them in the ol fashion way p2')
      state.attemptLogIn(urlParams.get('roomKey')!)
    }
  }
})
</script>

<template>
  <Warning/>
  <Login v-if="state.loggedIn === false"></Login>
  <ActionList v-else/>
  <Popup />
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
