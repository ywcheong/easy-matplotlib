import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type Ref } from "vue";

import { PyData, PyPlot, type PyPlotType } from "@/model/entities";
import { PyRequest } from "@/service/pyrequest";
import { PyDataValidator, PyPlotValidator } from "@/service/validator";
import { MessageManager, ConsoleMessageChannel, DirectToastMessageChannel } from "@/service/message";

export const usePyRequest = defineStore('pyrequest', () => {
    const messageManager = new MessageManager();
    let toastChannel = new DirectToastMessageChannel();
    let consoleChannel = new ConsoleMessageChannel();

    messageManager.addChannel(toastChannel);
    messageManager.addChannel(consoleChannel);

    const pyrequest = ref<PyRequest>(new PyRequest(messageManager)) as Ref<PyRequest>;
    const getDataList = computed(() => pyrequest.value.dataList);
    const getPlotList = computed(() => pyrequest.value.plotList);

    const addEmptyData = () => {
        const data = new PyData();
        pyrequest.value.dataList.push(data);
    }

    const removeData = (index: number) => {
        if (index < 0 || index >= pyrequest.value.dataList.length) {
            return;
        }

        pyrequest.value.dataList.splice(index, 1);
    }

    const formatDataName = (data: PyData): void => {
        const validator = new PyDataValidator(messageManager, data, pyrequest.value);
        validator.sendMessageIfFail(validator.formatName());
    }
    
    const formatDataValue = (data: PyData): void => {
        const validator = new PyDataValidator(messageManager, data, pyrequest.value);
        validator.sendMessageIfFail(validator.formatValue());
    }

    const addEmptyPlot = (plotType: PyPlotType) => {
        const plot = new PyPlot(plotType);
        pyrequest.value.plotList.push(plot);
    }

    const removePlot = (index: number) => {
        if (index < 0 || index >= pyrequest.value.plotList.length) {
            return;
        }
        pyrequest.value.plotList.splice(index, 1);
    }

    const formatPlotName = (plot: PyPlot): void => {
        const validator = new PyPlotValidator(messageManager, plot, pyrequest.value);
        validator.sendMessageIfFail(validator.formatName());
    }
    
    return {
        pyrequest,
        getDataList,
        getPlotList,
        addEmptyData,
        removeData,
        formatDataName,
        formatDataValue,
        addEmptyPlot,
        removePlot,
        formatPlotName,
    }
});