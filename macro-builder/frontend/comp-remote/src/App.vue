<script setup lang="ts">
import ActionMinis from './components/ActionMinisContainer.vue';
import FocusedActions from './components/FocusedAction.vue';
</script>

<template>
  <ActionMinis/>
  <FocusedActions :focused-action= "null"/>
</template>

<style scoped>

</style>
