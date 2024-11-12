import { PyData, PyPlot } from "@/model/entities";
import { PyDataValidator, PyRequestValidator } from "@/service/validator";
import { MessageManager } from "./message";

export class PyRequest {
    dataList: PyData[] = [];
    plotList: PyPlot[] = [];
    private requestValidator: PyRequestValidator;

    constructor(private messageManager: MessageManager) {
        this.requestValidator = new PyRequestValidator(messageManager);
    }
}