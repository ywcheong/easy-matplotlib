<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';

const alternativeRenderList = [
    {
        label: 'Render code only',
        icon: 'pi pi-code',
        size: 'small',
        command: () => {
            console.log('render-code-only-pressed');
        }
    },
]

</script>

<template>
    <header
        class="bg-theme-yellow text-black mt-2 mb-2 flex justify-between items-center text-sm md:flex-row flex-col h-9">
        <Toolbar class="w-[100%]">
            <template #start>
                <Button icon="pi pi-code" class="mr-2" severity="secondary" text />
                <Button icon="pi pi-image" class="mr-2" severity="secondary" text />
                <Button icon="pi pi-share-alt" severity="secondary" text />
            </template>

            <template #end>
                <SplitButton rounded :model="alternativeRenderList" size="small">
                    <span class="flex items-center">
                        <i class="pi pi-palette"></i>
                        <span class="pl-2 pr-3">
                            Render
                        </span>
                        <span class="text-xs p-0.5 bg-gray-200 text-gray-700 rounded">
                            Ctrl+S
                        </span>
                    </span>
                </SplitButton>
            </template>
        </Toolbar>
    </header>
</template>