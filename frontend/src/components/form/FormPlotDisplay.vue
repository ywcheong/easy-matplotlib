<script setup lang="ts">
import { ref } from 'vue';
import { Card, FloatLabel, InputText, Button, Select, Dialog } from 'primevue';
import { usePyRequestBuilder } from '@/stores/requestbuild';
import { PyData } from '@/model/entities';

const builder = usePyRequestBuilder();

// new plot select
const newPlotSelect = ref(false);
</script>

<template>
    <Card class="border border-black mb-3" v-for="(pyplot, index) in builder.getPlotList" :key="index">
        <!-- Title -->
        <template #title class="font-extrabold">{{ pyplot.getDescriptiveType() }}</template>

        <template #content>
            <!-- Plot Naming -->
            <FloatLabel class="mt-3" variant="on">
                <InputText v-model="pyplot.name" @blur="builder.checkPlotName(pyplot)"
                    v-tooltip.top="'Unique plot name.'" size="small" :invalid="pyplot.name.length === 0" />
                <label :for="`plot-name-${index}`" class="p-d-block">Plot Name</label>
            </FloatLabel>

            <Card class="border border-black mt-3">
                <template #title class="font-extrabold">Plot Data</template>
                <template #content>
                    <!-- Plot Data Assigning -->
                    <div class="mt-3" variant="on" v-for="(field, fieldName) in pyplot.dataSlot">
                        <div class="flex flex-row">
                            <div class="flex flex-column">
                                <span class="content-center mr-4">
                                    {{ `${fieldName} ${field.required ? '(*) ' : ''}:` }}
                                </span>
                            </div>
                            <div class="flex flex-column">
                                <Select @change="field.name = $event.value" size="small"
                                    :invalid="field.name.length === 0"
                                    :options="builder.getDataList.map((data: PyData) => ({ label: data.name, value: data.name }))"
                                    :placeholder="`(${fieldName})`" class="content-center" :key="fieldName" />
                            </div>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Plot Style Assigning // TODO -->
            <Card class="border border-black mt-3">
                <template #title class="font-extrabold">Plot Style</template>
                <template #content>
                    <FloatLabel class="mt-3" variant="on">
                        <!-- <InputText v-model="pyplot.name" v-tooltip.top="'Unique plot name.'" size="small"
                            :invalid="plotItem.name.length === 0" /> -->
                        <label :for="`plot-name-${index}`" class="p-d-block">Plot Name</label>
                    </FloatLabel>

                    <!-- New Style -->
                    <Button label="New Style" icon="pi pi-plus" class="p-button-success mt-3 mr-3" size="small"
                        @click="" />

                    <!-- Use Predefined Style -->
                    <Button label="Use Predefined Style" icon="pi pi-arrow-circle-down" class="p-button-success mt-3"
                        size="small" @click="" />
                </template>
            </Card>

            <!-- Delete Plot -->
            <Button label="Delete Plot" icon="pi pi-trash" class="p-button-danger mt-3" size="small"
                @click="builder.removePlot(index)" />

        </template>
    </Card>

    <Button label="New Plot" icon="pi pi-plus" class="p-button-success" size="small" @click="newPlotSelect = true;" />
    <Dialog header="New Plot" v-model:visible="newPlotSelect" :modal="true">
        <template #footer>
            <div class="grid grid-cols- gap-4">
                <div class="border border-black flex flex-col items-center"
                    @click="newPlotSelect = false; builder.addEmptyPlot('line');">
                    <img src="https://via.placeholder.com/150" alt="placeholder" />
                    <span>Line-Dot Plot</span>
                    <span>(.plot)</span>
                </div>
                <div class="border border-black flex flex-col items-center"
                    @click="newPlotSelect = false; builder.addEmptyPlot('scatter');">
                    <img src="https://via.placeholder.com/150" alt="placeholder" />
                    <span>Scatter Plot</span>
                    <span>(.scatter)</span>
                </div>
            </div>
        </template>
    </Dialog>


</template>