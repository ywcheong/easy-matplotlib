<script setup lang="ts">
import Panel from 'primevue/panel';
import ScrollPanel from 'primevue/scrollpanel';

import DataFormDisplay from '@components/DataFormDisplay.vue'

</script>

<template>
    <ScrollPanel>
        <Panel header="1. Setup Figure">
            Fig.subplot = (n, m)
            Fig.SetStyle
        </Panel>
        <Panel header="2. Prepare Data">
            <DataFormDisplay />
        </Panel>
        <Panel header="3. Draw Graph with Data">
            .UNLINK.PL1 <== SimplePlot(Dx, Dy)
            .UNLINK.PL1.SetStyle
        </Panel>
        <Panel header="4. Place Graph into Subplot">
            Axes[0][1] <- .UNLINK.PL1 + .UNLINK.PL2
            Axes[0][1].SetStyle
        </Panel>
        <Panel header="5. Render Figure">
            Click [Render (Ctrl + S)] to render your figure!
        </Panel>
    </ScrollPanel>
</template>