<template>
    <div class="w-full">
        <div class="flex mb-3 content-center" :key="updateCounter">
            <!-- Row Shape -->
            <IftaLabel class="ml-4 flex-initial">
                <InputNumber v-model="RenderRequest.getFigure.size.row" placeholder="# of Row"
                    v-tooltip.top="'Divide figure vertically by the given number. 1~6.'" size="small" type="number"
                    :min="1" :max="6" id="figrow" />
                <label for="figrow">Number of Rows</label>
            </IftaLabel>

            <span class="flex flex-col justify-center">
                <i class="pi pi-times ml-4 text-xl"></i>
            </span>

            <!-- Column Shape -->
            <IftaLabel class="ml-4 flex-initial">
                <InputNumber v-model="RenderRequest.getFigure.size.column" placeholder="# of Column"
                    v-tooltip.top="'Divide figure horizontally by the given number. 1~6.'" size="small" :min="1"
                    :max="6" id="figcol" />
                <label for="figcol">Number of Columns</label>
            </IftaLabel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import IftaLabel from 'primevue/iftalabel';
import { useRenderRequestStore } from '@/stores/RenderRequest';

const RenderRequest = useRenderRequestStore();
const updateCounter = ref(0);

const setRowNumber = (event: Event) => {
    const target = event.target as HTMLInputElement; // Type assertion for better type safety
    const value = parseInt(target.value);
    if (!isNaN(value)) {
        // Set value only after losing focus
        RenderRequest.getFigure.size.row = Math.min(Math.max(value, 1), 5);
        console.log(RenderRequest.getFigure)
    }
}

const setColumnNumber = (event: Event) => {
    const target = event.target as HTMLInputElement; // Type assertion for better type safety
    const value = parseInt(target.value);
    if (!isNaN(value)) {
        // Set value only after losing foc<b-form-input v-bind:value="name" @input="$emit('update:name', $event)"></b-form-input>us
        RenderRequest.getFigure.size.column = Math.min(Math.max(value, 1), 5);
    }
}
</script>
