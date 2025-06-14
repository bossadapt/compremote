<script setup lang="ts">
import { useRecieverStore } from '@/stores/reciever'
const reciever = useRecieverStore()
</script>
<template>
  <div class="offline">
    <button class="toggle-bridge-button" @click="reciever.startBridge()">Activate Bridge Connection</button>
  </div>
</template>
<style>
.offline{
    width:100%;
    height:90vh;
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
}
</style>
