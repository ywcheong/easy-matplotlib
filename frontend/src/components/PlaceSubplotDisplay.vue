<template>
    <div class="w-full">
        <div v-for="(dataItem, index) in RenderRequest.getData" :key="index">
            <div class="flex mb-3">
                <!-- Data Name Input -->
                <InputText v-model="dataItem.name" placeholder="Data Name"
                    v-tooltip.top="'This will be compiled as `data_givenname`.'" size="small"
                    class="ml-4 flex-initial" />

                <!-- Data Value Input -->
                <InputText v-model="dataItem.raw_value" @blur="cleanseData(index)" placeholder="Data Value"
                    v-tooltip.top="'Only accepts comma-seperated numbers.'" size="small" class="ml-4 flex-auto" />

                <!-- Delete Button -->
                <Button icon="pi pi-times" @click="deleteData(index)" class="ml-4 mr-4" />
            </div>
        </div>

        <!-- Add New Data Button -->
        <Button label="New Data" icon="pi pi-plus" class="p-button-success mt-2" size="small" @click="addNewData" />
    </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { useRenderRequestStore } from '@/stores/RenderRequest';

const RenderRequest = useRenderRequestStore();

// Function to add a new empty data row
const addNewData = RenderRequest.addEmptyData;

// Function to delete a data row by index
const deleteData = RenderRequest.deleteData;

// Function to cleanse user input and convert it into number[]
const cleanseData = (index: number) => {
    let rawValue = RenderRequest.getData[index].raw_value;

    // Remove unwanted characters like parentheses, brackets, braces, and spaces
    rawValue = rawValue?.replace(/[()\[\]{}]/g, '').replace(/\s+/g, '');

    // Split the string by commas and convert to numbers
    const cleansedValues = rawValue?.split(',').map(item => parseFloat(item)).filter(val => !isNaN(val));

    // Update the value with the cleansed number array joined back as a string
    RenderRequest.getData[index].raw_value = cleansedValues?.join(', ');
    RenderRequest.getData[index].value = cleansedValues ?? [];
};
</script>