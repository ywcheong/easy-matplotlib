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
    <SplitterPanel class="editor-area" :min-size="20">
      <EditorFormDisplay />
    </SplitterPanel>
  </Splitter>
</template>

<style scoped>
.editor-area {
  overflow: auto !important;
}
</style>
