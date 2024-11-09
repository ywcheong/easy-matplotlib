<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderDisplay from '@components/HeaderDisplay.vue';
import FooterDisplay from '@components/FooterDisplay.vue';
</script>

<template>
  <div class="flex flex-col h-dvh">
    <HeaderDisplay/>
    <RouterView class="flex-1 overflow-auto h-[100%]"/>
    <FooterDisplay/>
  </div>
</template>