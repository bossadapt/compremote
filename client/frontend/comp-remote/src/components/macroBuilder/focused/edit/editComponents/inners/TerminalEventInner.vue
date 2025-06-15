<script setup lang="ts">
import type { TerminalEvent } from '@/helpers/sharedInterfaces'
import Position from './../helpers/Position.vue'
defineProps<{
  event: TerminalEvent
}>()
</script>
<template>
  <div class="inner">
    <div class="section">
      <h3>Commands:</h3>
      <div class="commands-container">
        <div class="command" v-for="(_command, index) in event.commands">
          <button @click="event.commands.splice(index, 1)">Remove</button>
          <input v-model="event.commands[index]" type="text" />
          <h3>;</h3>
        </div>
        <button class="add-command-button" @click="event.commands.push('')">Add</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.commands-container {
  display: flex;
  flex-direction: column;
}
.command {
  display: flex;
  flex: row;
}
.add-command-button{
    min-width: 2rem;
}
.section{
    align-items: center;
}
button{
    font-size: 20px;
    background-color: var(--background);
    color: var(--primary);
}
.command input {
  font-size: 20px;
}
</style>
