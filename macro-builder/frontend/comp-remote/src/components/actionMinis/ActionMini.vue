<script setup lang="ts">
import type { Action } from '../../helpers/sharedInterfaces'

defineProps<{
  action: Action
}>()
</script>
<template>
    <div class="main-mini">
        <div class="mini-contents">
            <h3 class="title-h3">{{action.Name}}</h3>
            <button class="delete-button">Delete</button>
        </div>
    </div>
</template>
<style scoped>
    .main-mini{
        background-color: var(--background);
        margin-left: 10px;
        margin-right: 10px;
        margin-top: 17px;
        border-radius: 7px;
    }
    .mini-contents{
        display:flex;
        flex-direction: row;
        margin-left: 1%;
        margin-right: 1%;
    }
    .title-h3{
        color: var(--text);
        font-size: 20px;
        width: 80%;
        height: 100%;
    }
    .delete-button{
        color: var(--danger);
        background-color: var(--background);
        border: 0px;
        width: 20%;
        font-size: 20px;
        height: 100%;
        margin-top: auto;
        margin-bottom: auto;
    }
</style>