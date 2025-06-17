<script setup lang="ts">
import { useStateStore } from '@/stores/state';

const state = useStateStore()
</script>
<template>
  <div class="warning-container" v-if="state.warningMessage !== null">
    <h2 class="warning-contents">{{ state.warningMessage }}</h2>
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