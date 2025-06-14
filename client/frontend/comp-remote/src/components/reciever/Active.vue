<script setup lang="ts">
import { useRecieverStore } from '@/stores/reciever'
const reciever = useRecieverStore()
</script>
<template>
  <div class="active">
    <button class="toggle-bridge-button" @click="reciever.stopBridge()">
      Disable Bridge Connection
    </button>
    <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Request History</th>
        </tr>
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
  </div>
</template>
<style>
.active {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.table-container{
    max-height: 500px;
    height: 500px;
    overflow-y: scroll;
}
table{
    min-width: 600px;
}
th {
  border: 2px solid white;
}
td {
  border: 1px solid white;
}
</style>
