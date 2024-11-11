<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
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
                <Button size="small" class="mr-4">
                    <span class="flex items-center">
                        <i class="pi pi-code"></i>
                        <span class="pl-2">
                            Render Code Only
                        </span>
                    </span>
                </Button>
                <Button size="small">
                    <span class="flex items-center">
                        <i class="pi pi-palette"></i>
                        <span class="pl-2 pr-2">
                            Render All
                        </span>
                        <span class="text-xs p-0.5 bg-gray-200 text-gray-700">
                            Ctrl+S
                        </span>
                    </span>
                </Button>
            </template>
        </Toolbar>
    </header>
</template>