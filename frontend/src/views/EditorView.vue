<script setup lang="ts">
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';

import RenderDisplay from '@components/RenderDisplay.vue';
import EditorFormDisplay from '@components/EditorFormDisplay.vue';
</script>

<template>
  <Splitter>
    <SplitterPanel :min-size="20">
      <RenderDisplay />
    </SplitterPanel>
    <SplitterPanel :min-size="20">
      <EditorFormDisplay />
    </SplitterPanel>
  </Splitter>
</template>
