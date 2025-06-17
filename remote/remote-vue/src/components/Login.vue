<script setup lang="ts">
import { useStateStore } from '@/stores/state';
import { onMounted, ref, type Ref } from 'vue'
const roomKey: Ref<string> = ref('')
const state = useStateStore()
</script>
<template>
  <div class="main-container">
    <div class="contents">
      <h1 class="header">Connect</h1>
      <input type="text" v-model="roomKey" placeholder="roomkey ex:sdlkfj3i23@#$" />
      <button @click="state.attemptLogIn(roomKey)">Connect to Reciever</button>
    </div>
  </div>
</template>

<style scoped>
.header {
  margin-bottom: 0px;
}
.main-container {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.contents {
  display: flex;
  flex-direction: column;
}
button {
  height: 2rem;
}
</style>
