<script setup lang="ts">
import { useRecieverStore } from '@/stores/reciever';
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { RecieverStatus } from '@/helpers/sharedInterfaces'
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
  <div v-if="reciever.bridgeState.status === RecieverStatus.OFFLINE">
    <button @click="reciever.startBridge()">Activate Bridge Connection</button>
  </div>
  <div v-if="reciever.bridgeState.status === RecieverStatus.AWAITING_CONNECTION">
    <h4>Room Code: {{ reciever.bridgeState.roomKey }}</h4>
    <img class="mt-6 mb-2 rounded border" :src="qrcode.value" alt="No Room Key Available" />
    <h4>Awaiting Connection</h4>
    <button @click="reciever.stopBridge()">Disable Bridge Connection</button>
  </div>
  <div v-if="reciever.bridgeState.status === RecieverStatus.ACTIVE">
    <button @click="reciever.stopBridge()">Disable Bridge Connection</button>
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in reciever.bridgeState.requestHistory">
          <td>{{ request.type }}</td>
          <td>{{ request.desc }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped></style>
