<script setup lang="ts">
import Panel from 'primevue/panel';
import ScrollPanel from 'primevue/scrollpanel';
import Button from 'primevue/button';

import FormDataDisplay from './FormDataDisplay.vue';
import FormPlotDisplay from './FormPlotDisplay.vue';
import FormAxesDisplay from './FormAxesDisplay.vue';
import FormFigureDisplay from './FormFigureDisplay.vue';

</script>

<template>
    <ScrollPanel>
        <Panel header="Data">
            <FormDataDisplay />
        </Panel>
        <Panel header="Plot">
            <FormPlotDisplay />
        </Panel>
        <Panel header="Axes">
            <!-- TODO <FormAxesDisplay /> -->
        </Panel>
        <Panel header="Figure">
            <!-- TODO <FormFigureDisplay /> -->
        </Panel>
    </ScrollPanel>
</template>