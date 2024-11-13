import { defineStore } from "pinia";
import { ref, computed, toRef, watch } from "vue";
import { type Ref } from "vue";

import { type PyPlotType } from "@/model/entities";
import { PyData, PyPlot, PyRequest } from "@/model/entities";
import { PyDataValidator, PyPlotValidator } from "@/service/validator";
import { MessageManager, ConsoleMessageChannel } from "@/service/message";
import { DirectToastMessageChannel } from "@/service/message.toast";
import { GlobalTranslator } from "@/service/translator";

export const usePyRequestBuilder = defineStore('pyrequest', () => {
    const messageManager = new MessageManager();
    messageManager.addChannel(new DirectToastMessageChannel());
    messageManager.addChannel(new ConsoleMessageChannel());

    const pyrequest = ref<PyRequest>(new PyRequest()) as Ref<PyRequest>;
    const getDataList = computed<PyData[]>(() => pyrequest.value.dataList);
    const getPlotList = computed<PyPlot[]>(() => pyrequest.value.plotList);
    const getBase64 = computed<Promise<string>>(async () => {
        const JSONString = await GlobalTranslator.PyRequestToJSON(pyrequest.value);
        const Base64String = await GlobalTranslator.JSONToBase64(JSONString);
        return Base64String
    });

    const updatePyRequest = async (newPyRequest: PyRequest) => {
        pyrequest.value = newPyRequest;
    }

    const addEmptyData = async () => {
        const data = new PyData();
        pyrequest.value.dataList.push(data);
    }

    const removeData = async (index: number) => {
        if (index < 0 || index >= pyrequest.value.dataList.length)
            return;
        pyrequest.value.dataList.splice(index, 1);
    }

    const checkDataName = async (data: PyData) => {
        const validator = new PyDataValidator(messageManager, data, pyrequest.value);
        const isValid = await validator.isValidName();
        if (!isValid) {
            data.name = "";
        }
    }

    const checkDataValue = async (data: PyData) => {
        const validator = new PyDataValidator(messageManager, data, pyrequest.value);
        const isValid = await validator.isValidFormat();
        if (!isValid) {
            data.value = "";
            data.valueShape = [];
        }
    }

    const addEmptyPlot = async (plotType: PyPlotType) => {
        const plot = new PyPlot(plotType);
        pyrequest.value.plotList.push(plot);
    }

    const removePlot = async (index: number) => {
        if (index < 0 || index >= pyrequest.value.plotList.length)
            return;
        pyrequest.value.plotList.splice(index, 1);
    }

    const checkPlotName = async (plot: PyPlot) => {
        const validator = new PyPlotValidator(messageManager, plot, pyrequest.value);
        const isValid = await validator.isValidName();
        if (!isValid) {
            plot.name = "";
        }
    }

    return {
        pyrequest,
        getDataList,
        getPlotList,
        getBase64,
        updatePyRequest,
        addEmptyData,
        removeData,
        checkDataName,
        checkDataValue,
        addEmptyPlot,
        removePlot,
        checkPlotName,
    }
});