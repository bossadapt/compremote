<script setup lang="ts">
defineProps<{
  warningMessage: string|null
}>()
</script>
<template>
  <div class="warning-container" v-if="warningMessage !== null">
    <h2 class="warning-contents">{{ warningMessage }}</h2>
  </div>
  </template>
  <style scoped>
  .warning-container{
    margin-left: auto;
    margin-right: auto;
    background-color: red;
  }
  .warning-contents{
    color: black;
    text-align: center;
  }
</style>