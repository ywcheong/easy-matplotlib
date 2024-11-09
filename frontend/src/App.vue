<script setup lang="ts">
import { RouterView } from 'vue-router';
import HeaderDisplay from '@components/HeaderDisplay.vue';
import FooterDisplay from '@components/FooterDisplay.vue';
</script>

<template>
  <div class="flex flex-col h-dvh text-sm">
    <HeaderDisplay class="flex-shrink-0"/>
    <RouterView class="flex-grow overflow-auto min-h-2"/>
    <FooterDisplay class="flex-shrink-0"/>
  </div>
</template>