<script setup lang="ts">
import { FloatLabel, InputText, Button } from 'primevue';
import { useRequestPack } from '@/stores/RequestPack';

const requestPack = useRequestPack();
const dataList = requestPack.getDataList;
</script>

<template>
    <div class="w-full">
        <!-- Add New Data Button -->
        <Button label="New Data" icon="pi pi-plus" class="p-button-success mb-4" size="small"
            @click="dataList.addNewElement()" />

        <div v-for="(dataElement, dataIndex) in dataList.list" :key="dataIndex">
            <div class="flex mt-3">
                <!-- Data Name Input -->
                <FloatLabel variant="on" :id="`data-name-${dataIndex}`" class="ml-4 flex-initial">
                    <InputText v-model="dataElement.name" @blur="dataElement.verifyName(dataList.list)" v-tooltip.bottom="'Unique data name.'" size="small"
                        :invalid="dataElement.name.length === 0" />
                    <label :for="`data-name-${dataIndex}`" class="p-d-block">Data Name</label>
                </FloatLabel>

                <!-- Data Value Input -->
                <FloatLabel variant="on" :id="`data-value-${dataIndex}`" class="ml-4 flex-auto">
                    <InputText v-model="dataElement.value" @blur="dataElement.verifyValue()"
                        v-tooltip.bottom="'Only accepts comma-seperated int/float(mix allowed).'" size="small"
                        class="w-full" :invalid="dataElement.value.length === 0" />
                    <label :for="`data-value-${dataIndex}`" class="p-d-block">Data Value (shape = ({{
                        dataElement.valueShape.join(", ") }}))</label>
                </FloatLabel>

                <!-- Delete Button -->
                <Button icon="pi pi-trash" @click="dataList.removeDataElement(dataIndex)"
                    class="p-button-danger ml-4 mr-4 flex-initial" />
            </div>
        </div>
    </div>
</template>