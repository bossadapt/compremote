<script setup lang="ts">
import ActionList from './actionList/ActionList.vue';
import FocusedAction from './focused/FocusedAction.vue';
</script>
<template>
    <div class="main-container">
    <ActionList/>
    <FocusedAction/>
    </div>
</template>
<style scoped>
.main-container {
  display: flex;
  flex-direction: row;
  margin-left: 2%;
  margin-right: 2%;
  margin-top: 2%;
  width: 96%;
  overflow-y: scroll;
}
</style>