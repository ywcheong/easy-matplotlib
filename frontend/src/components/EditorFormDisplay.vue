<script setup lang="ts">
import Panel from 'primevue/panel';
import ScrollPanel from 'primevue/scrollpanel';

import PrepareDataDisplay from '@components/PrepareDataDisplay.vue'
import SetupFigureDisplay from '@components/SetupFigureDisplay.vue';
import PlaceSubplotDisplay from './PlaceSubplotDisplay.vue';

</script>

<template>
    <ScrollPanel>
        <Panel header="1. Setup Figure">
            <SetupFigureDisplay />
            [TODO FigureStyleDisplay /]
        </Panel>
        <Panel header="2. Prepare Data">
            <PrepareDataDisplay />
        </Panel>
        <Panel header="3. Draw Graph with Data">
            .UNLINK.PL1 <== SimplePlot(Dx, Dy)
            [PER TODO PlotStyleDisplay /]
        </Panel>
        <Panel header="4. Place Graph into Subplot">
            <PlaceSubplotDisplay />
            Axes[0][1] <- .UNLINK.PL1 + .UNLINK.PL2
            [PER TODO PlotStyleDisplay /]
        </Panel>
    </ScrollPanel>
</template>