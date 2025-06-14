<script setup lang="ts">
import { useRecieverStore } from '@/stores/reciever'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { computed } from 'vue';
const reciever = useRecieverStore()
const qrcode = computed(() =>
  {
    console.log('https://bossadapt.org/remote/?roomKey='+ encodeURIComponent(reciever.bridgeState.roomKey));
    return useQRCode('https://bossadapt.org/remote/?roomKey='+ encodeURIComponent(reciever.bridgeState.roomKey), {
    errorCorrectionLevel: 'H',
    margin: 3,
  })}
)
</script>
<template>
  <div  class="awaiting">
    <h4>Room Code: {{ reciever.bridgeState.roomKey }}</h4>
    <img class="mt-6 mb-2 rounded border" :src="qrcode.value" alt="No Room Key Available" />
    <h4>Awaiting Connection</h4>
    <button class="toggle-bridge-button" @click="reciever.stopBridge()">Disable Bridge Connection</button>
  </div>
</template>
<style>
.awaiting{
    width:100%;
    height:90vh;
    display:flex;
    flex-direction:column;
    align-items: center;
    justify-content: center;
}

</style>