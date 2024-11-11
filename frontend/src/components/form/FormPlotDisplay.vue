<template>
    <Card class="border border-black mb-3" v-for="(plotItem, index) in RenderRequest.getPlot" :key="index">
        <!-- Title -->
        <template #title class="font-extrabold">Simple Plot</template>

        <template #content>
            <!-- Plot Naming -->
            <FloatLabel class="mt-3" variant="on">
                <InputText v-model="plotItem.name" v-tooltip.top="'Unique plot name.'" size="small"
                    :invalid="plotItem.name.length === 0" />
                <label :for="`plot-name-${index}`" class="p-d-block">Plot Name</label>
            </FloatLabel>

            <Card class="border border-black mt-3">
                <template #title class="font-extrabold">Plot Data</template>
                <template #content>
                    <!-- Plot Data Assigning -->
                    <div class="mt-3" variant="on" v-for="(memberName, memberIndex) in plotItem.data.getMembers()">
                        <div class="flex flex-row">
                            <div class="flex flex-column">
                                <span class="content-center mr-4">
                                    {{ plotItem.data.isMemberRequired(memberName) ? 'Required:' : 'Optional:' }}
                                </span>
                            </div>
                            <div class="flex flex-column">
                                <Select
                                    @change="plotItem.data.setMemberAs(memberName, $event.value); console.log(plotItem)"
                                    size="small" :invalid="isPlotMemberInvalid(plotItem, memberName)"
                                    :options="RenderRequest.getDataNames()" :placeholder="`(${memberName})`"
                                    class="content-center" :key="memberIndex" />
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
                        <InputText v-model="plotItem.name" v-tooltip.top="'Unique plot name.'" size="small"
                            :invalid="plotItem.name.length === 0" />
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
                @click="deletePlot(index)" />

        </template>
    </Card>

    <Button label="New Plot" icon="pi pi-plus" class="p-button-success" size="small" @click="addNewPlot" />
</template>

<script setup lang="ts">
import { Card, FloatLabel, InputText, Button, Select } from 'primevue';
import { useRenderRequestStore, PlotElement } from '@/stores/RenderRequest';

const RenderRequest = useRenderRequestStore();

const addNewPlot = () => RenderRequest.addEmptyPlot('plot');

const deletePlot = (index: number) => RenderRequest.deletePlot(index);

const isPlotMemberInvalid = (plotItem: PlotElement, memberName: string) => {
    return plotItem.data.isMemberRequired(memberName) && plotItem.data.getMemberData(memberName).length === 0;
};
</script>

<style lang="css" scoped></style>