<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  actions: string[]
  playFunction: (action: string) => void
  getActionsFunction: () => void
}>()
const search = ref('')
</script>
<template>
    <div class="container">
  <div class="header">
    <button class="refresh" @click="getActionsFunction()">Refresh Actions</button>
    <input class="search" type="text" v-model="search" placeholder="search for items here" />
  </div>
  <div class="cards">
    <button
      v-for="action in actions.filter((val) => {
        return val.includes(search)
      })"
      @click="playFunction(action)"
    >
      {{ action }}
    </button>
  </div>
  </div>
</template>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}
.container {
  max-width: 100%;
  display: flex;
  flex-direction: column;
}


button {
  cursor: pointer;
}
.header {
  width: 100%;
  margin-bottom: 1rem;
}
.search {
  width: 100%;
  height: 4rem;
}
.refresh {
  height: 4rem;
  width: 220px;

  color: white;
  background-color: black;
}

.cards {
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  box-sizing: border-box;
}
.cards button {
  background-color: black;
  color: white;
  padding: 1rem;
  height: 4rem;
}

</style>
