import { PyValidator, type Failure } from "@/interface/validator";
import { PyData, PyPlot } from "@/model/entities";
import { PyRequest } from "@/service/pyrequest";

import { MessageManager } from "@/service/message";

export class PyDataValidator extends PyValidator {
    constructor(
        protected messageManager: MessageManager,
        protected data: PyData,
        protected pyrequest: PyRequest
    ) {
        super(messageManager);
    }

    formatName(): Failure | true {
        // RequestPack.ts verifyName
        const given_name = this.data.name;

        if (!given_name) {
            return { summary: "Invalid Data Name", detail: "Name must not be empty" };
        }

        if (this.pyrequest.dataList.some((data) => data !== this.data && data.name === given_name)) {
            this.data.name = "";
            return { summary: "Invalid Data Name", detail: "Name must be unique" };
        }

        return true;
    }

    formatValue(): Failure | true {
        // RequestPack.ts verifyValue
        let given_text = this.data.value;
        let is_wrapped = false;

        if (!given_text) {
            this.data.value = "";
            this.data.valueShape = [];
            return { summary: "Invalid Data Value", detail: "Empty Data" };
        }

        // Check if the cleaned text is a list
        if (!given_text.startsWith("[") || !given_text.endsWith("]")) {
            is_wrapped = true;
            given_text = `[${given_text}]`;
        }

        const cleanedText = given_text.replace(/\s+/g, ' ').trim();

        // Check if the cleaned text follows the Python List[Union[float, int]] style
        try {
            const parsed = JSON.parse(cleanedText);

            if (!Array.isArray(parsed)) {
                // Not a valid Array
                this.data.value = "";
                this.data.valueShape = [];
                return { summary: "Invalid Data Value", detail: "Data is not an array" };
            }

            const is1DArray = parsed.every((item) => typeof item === 'number');
            const is2DArray = parsed.every((item) => Array.isArray(item) && item.every((subItem) => typeof subItem === 'number'));

            if (is1DArray) {
                if (is_wrapped)
                    this.messageManager.sendInfo("Data Formatting", "Your data is automatically wrapped in a list");

                this.data.value = cleanedText;
                this.data.valueShape = [parsed.length];

                return true;
            }

            if (is2DArray) {
                const firstRowLength = parsed[0].length;
                const isRectangular = parsed.every((row) => row.length === firstRowLength);

                if (!isRectangular) {
                    this.data.value = "";
                    this.data.valueShape = [];
                    return { summary: "Invalid Data Value", detail: "Data is not a rectangular form" };
                }

                if (is_wrapped)
                    this.messageManager.sendInfo("Auto Data Formatting", "Your data is automatically wrapped in a list");

                this.data.value = cleanedText;
                this.data.valueShape = [parsed.length, firstRowLength];
                return true;
            }

            // Not 1D/2D array
            this.data.value = "";
            this.data.valueShape = [];
            return { summary: "Invalid Data Value", detail: "Data must be a 1D or 2D array of numbers" };

        } catch (e) {
            // JSON parsing failed, not a valid list
            this.data.value = "";
            this.data.valueShape = [];
            return { summary: "Invalid Data Value", detail: "JSON Parse failed" };
        }
    }

    collectProblems(): Failure[] {
        // todo
        const problems: Failure[] = [];

        // formatName & formatValue
        const nameResult = this.formatName();
        if (nameResult !== true) {
            problems.push(nameResult);
        }

        const valueResult = this.formatValue();
        if (valueResult !== true) {
            problems.push(valueResult);
        }

        return problems;
    }
}

export class PyPlotValidator extends PyValidator {
    constructor(
        protected messageManager: MessageManager,
        protected plot: PyPlot,
        protected pyrequest: PyRequest
    ) {
        super(messageManager);
    }

    formatName(): Failure | true {
        // Check name uniqueness
        const given_name = this.plot.name;

        if (!given_name) {
            return { summary: "Invalid Plot Name", detail: "Name must not be empty" };
        }

        if (this.pyrequest.plotList.some((plot) => plot !== this.plot && plot.name === given_name)) {
            this.plot.name = "";
            return { summary: "Invalid Plot Name", detail: "Name must be unique" };
        }

        return true;
    }

    formatDataSlot(fieldName: string): Failure | true {
        // Check if the data slot is valid
        const dataSlot = this.plot.dataSlot;

        if (!dataSlot) {
            return { summary: "CRITICAL ERROR", detail: "Reset Program (ERRCODE: DATASLOT-NOT-FOUND)" };
        }

        // For each field name on PyDataSlot, check if the given field name is valid
        for (const field in dataSlot) {
            if (field === fieldName) {
                // Check if dataName exists among the dataList
                const dataName = dataSlot[field].name;
                const dataExists = this.pyrequest.dataList.some((data) => data.name === dataName);

                if (!dataExists) {
                    dataSlot[field].name = "";
                    return { summary: "Invalid Data Slot", detail: `Data "${dataName}" not found` };
                }
            }
        }

        return true;
    }

    collectProblems(): Failure[] {
        // todo
        const problems: Failure[] = [];
        return problems;
    }
}

export class PyRequestValidator extends PyValidator {
    constructor(protected messageManager: MessageManager) {
        super(messageManager);
    }

    collectProblems(): Failure[] {
        // todo
        const problems: Failure[] = [];
        return problems;
    }

    // format~(): Failure | true
    //  -> [Modifier, called via the component event (e.g. @blur)]

    // collectProblems(): Failure[]
    //  -> [Modifier, called from the Translate module.
    //      It calls format~() and collects the results to return as an array.]
}