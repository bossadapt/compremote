<script setup lang="ts">
import ActionMinis from './components/ActionMinisContainer.vue';
import FocusedActions from './components/FocusedAction.vue';
</script>

<template>
  <div class="main-container">
    <link href='https://fonts.googleapis.com/css?family=JetBrains Mono' rel='stylesheet'>
    <ActionMinis :actions="[]"/>
    <FocusedActions :focused-action= "null"/>
  </div>
</template>

<style>
  :root{
    --text : #EAEEF2;
    --background : #040608;
    --primary : #A1BED4;
    --secondary : #2B5371;
    --accent : #5395C8;
    --danger : #A71A1A;
  }
  body {
    font-family: 'JetBrains Mono';
    background-color: var(--background);
  }
  .main-container{
    display: flex;
    flex-direction: row;
    margin-left: 2%;
    margin-right: 2%;
    margin-top: 2%;
    width: 96%;
    overflow-y: scroll;
  }
</style>
