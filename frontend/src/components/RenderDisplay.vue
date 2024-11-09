<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import RenderCodeDisplay from '@components/RenderCodeDisplay.vue';
import RenderFigureDisplay from '@components/RenderFigureDisplay.vue';
</script>

<template>
  <Splitter layout="vertical" class="h-[100%]">
    <SplitterPanel :min-size="20" :size="50">
      <RenderFigureDisplay />
    </SplitterPanel>
    <SplitterPanel :min-size="20" :size="50">
      <RenderCodeDisplay />
    </SplitterPanel>
  </Splitter>
</template>