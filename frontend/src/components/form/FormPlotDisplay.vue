<template>
    <Card class="border border-black mb-3" v-for="(plotItem, index) in RenderRequest.getPlot" :key="index">
        <!-- Title -->
        <template #title class="font-extrabold">{{ plotItem.data.getDescriptivePlotType() }}</template>

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

    <Button label="New Plot" icon="pi pi-plus" class="p-button-success" size="small" @click="newPlotSelect = true;"/>
    <Dialog header="New Plot" v-model:visible="newPlotSelect" :modal="true">
        <template #footer>
            <!-- Display 3 x 3 squares, each square has black border with descriptive image at its center, and below the image,
             the description text is displayed. 
                After clicking on the square, the dialog will close and the new plot will be added to the list. -->
            <div class="grid grid-cols-4 gap-4">
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('plot');" />
                    <span>Line-Dot Plot</span>
                    <span>(.plot)</span>
                </div>
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('scatter');" />
                    <span>Scatter Plot</span>
                    <span>(.scatter)</span>
                </div>
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('bar');" />
                    <span>Bar Plot</span>
                    <span>(.bar)</span>
                </div>
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('pie');" />
                    <span>Pie Plot</span>
                    <span>(.pie)</span>
                </div>
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('fill');" />
                    <span>Fill Plot</span>
                    <span>(.fill)</span>
                </div>
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('imshow');" />
                    <span>Image Show Plot</span>
                    <span>(.imshow)</span>
                </div>
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('contour');"/>
                    <span>Contour Plot</span>
                    <span>(.contour)</span>
                </div>
                <div class="border border-black flex flex-col items-center">
                    <img src="https://via.placeholder.com/150" alt="placeholder" @click="newPlotSelect = false; RenderRequest.addEmptyPlot('pcolormesh');" />
                    <span>Color Mesh Plot</span>
                    <span>(.pcolormesh)</span>
                </div>
            </div>
        </template>
    </Dialog>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Card, FloatLabel, InputText, Button, Select, Dialog } from 'primevue';
import { useRenderRequestStore, PlotElement } from '@/stores/RenderRequest';

const RenderRequest = useRenderRequestStore();

const deletePlot = (index: number) => RenderRequest.deletePlot(index);

const isPlotMemberInvalid = (plotItem: PlotElement, memberName: string) => {
    return plotItem.data.isMemberRequired(memberName) && plotItem.data.getMemberData(memberName).length === 0;
};

// new plot select
const newPlotSelect = ref(false);
</script>

<style lang="css" scoped></style>