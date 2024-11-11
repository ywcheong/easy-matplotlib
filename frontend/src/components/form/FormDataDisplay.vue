<template>
    <div class="w-full">
        <!-- Add New Data Button -->
        <Button label="New Data" icon="pi pi-plus" class="p-button-success mb-4" size="small" @click="addNewData" />

        <div v-for="(dataItem, index) in RenderRequest.getData" :key="index">
            <div class="flex mt-3">
                <!-- Data Name Input -->
                <FloatLabel variant="on" :id="`data-name-${index}`" class="ml-4 flex-initial">
                    <InputText v-model="dataItem.name" v-tooltip.top="'Unique data name.'"
                        size="small" :invalid="dataItem.name.length === 0" />
                    <label :for="`data-name-${index}`" class="p-d-block">Data Name</label>
                </FloatLabel>

                <!-- Data Value Input -->
                <FloatLabel variant="on" :id="`data-value-${index}`" class="ml-4 flex-auto">
                    <InputText v-model="dataItem.value_text" @blur="cleanseData(index)"
                        v-tooltip.top="'Only accepts comma-seperated int/float(mix allowed).'" size="small" class="w-full"
                        :invalid="dataItem.value.length === 0" />
                    <label :for="`data-value-${index}`" class="p-d-block">Data Value (length = {{ dataItem.value.length }})</label>
                </FloatLabel>

                <!-- Delete Button -->
                <Button icon="pi pi-trash" @click="deleteData(index)" class="p-button-danger ml-4 mr-4 flex-initial" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FloatLabel, InputText, Button } from 'primevue';

import { useRenderRequestStore } from '@/stores/RenderRequest';

const RenderRequest = useRenderRequestStore();

// Function to add a new empty data row
const addNewData = RenderRequest.addEmptyData;

// Function to delete a data row by index
const deleteData = RenderRequest.deleteData;

// Function to cleanse user input and convert it into number[]
const cleanseData = (index: number) => {
    let rawValue = RenderRequest.getData[index].value_text;

    // Remove unwanted characters like parentheses, brackets, braces, and spaces
    rawValue = rawValue?.replace(/[()\[\]{}]/g, '').replace(/\s+/g, '');

    // Check if the rawValue is a valid numeric array using regex
    const isValidNumericArray = /^(\d+(\.\d+)?)(,\d+(\.\d+)?)*$/.test(rawValue || '');

    if (!isValidNumericArray) {
        RenderRequest.getData[index].value_text = '';
        RenderRequest.getData[index].value = [];
        return;
    }

    // Split the string by commas and convert to numbers
    const cleansedValues = rawValue?.split(',').map(item => parseFloat(item));

    // Update the value with the cleansed number array joined back as a string
    RenderRequest.getData[index].value_text = (cleansedValues ?? []).join(', ');
    RenderRequest.getData[index].value = cleansedValues ?? [];
};
</script>