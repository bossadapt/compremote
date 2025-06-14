<script setup lang="ts">
import { useRecieverStore } from '@/stores/reciever';
import { RecieverStatus } from '@/helpers/sharedInterfaces'
import Active from './Active.vue';
import Awaiting from './Awaiting.vue';
import Offline from './Offline.vue';
const reciever = useRecieverStore()
</script>
<template>
  <Offline v-if="reciever.bridgeState.status === RecieverStatus.OFFLINE"/>
  <Awaiting v-else-if="reciever.bridgeState.status === RecieverStatus.AWAITING_CONNECTION"/>
  <Active v-else />
</template>
<style>
button{
  cursor: pointer;
}
.toggle-bridge-button{
  color: var(--text);
  background-color: var(--background);
  padding: 2vh;
  font-size: 2vh;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
