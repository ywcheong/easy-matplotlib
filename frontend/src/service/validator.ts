import { PyValidator } from "@/interface/validator";
import { PyData, PyPlot, PyRequest } from "@/model/entities";

import { MessageManager } from "@/service/message";

export class PyDataValidator extends PyValidator {
    constructor(
        protected messageManager: MessageManager,
        protected data: PyData,
        protected pyrequest: PyRequest
    ) {
        super(messageManager);
    }

    async isValidName(): Promise<boolean> {
        // RequestPack.ts verifyName
        const given_name = this.data.name;

        if (!given_name) {
            this.messageManager.sendError("Invalid Data Name", "Name must not be empty");
            return false;
        }

        if (this.pyrequest.dataList.some((data) => data !== this.data && data.name === given_name)) {
            this.messageManager.sendError("Invalid Data Name", "Name must be unique");
            return false;
        }

        return true;
    }

    async isValidFormat(): Promise<boolean> {
        let given_text = this.data.value;
        let is_wrapped = false;

        if (!given_text) {
            this.messageManager.sendError("Invalid Data Value", "Data must not be empty");
            return false;
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
                this.messageManager.sendError("Invalid Data Value", "Data must be an array");
                return false;
            }

            const is1DArray = parsed.every((item) => typeof item === 'number');
            const is2DArray = parsed.every((item) => Array.isArray(item) && item.every((subItem) => typeof subItem === 'number'));

            if (is1DArray) {
                if (is_wrapped)
                    this.messageManager.sendInfo("Data Formatting", "Your data has been automatically wrapped in a list");

                this.data.value = cleanedText;
                this.data.valueShape = [parsed.length];
                return true;
            }

            if (is2DArray) {
                const firstRowLength = parsed[0].length;
                const isRectangular = parsed.every((row) => row.length === firstRowLength);

                if (!isRectangular) {
                    this.messageManager.sendError("Invalid Data Value", "Data is not a rectangular form");
                    return false;
                }

                if (is_wrapped)
                    this.messageManager.sendInfo("Data Formatting", "Your data has been automatically wrapped in a list");

                this.data.value = cleanedText;
                this.data.valueShape = [parsed.length, firstRowLength];
                return true;
            }

            // Not 1D/2D array
            this.messageManager.sendError("Invalid Data Value", "Data must be a 1D or 2D array of numbers");
            return false;

        } catch (e) {
            // JSON parsing failed, not a valid list
            this.messageManager.sendError("Invalid Data Value", "Data must be a valid JSON array");
            return false;
        }
    }

    async validate(): Promise<boolean> {
        // formatName & formatValue
        const name = await this.isValidName();
        const format = await this.isValidFormat();

        return name && format;
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

    async isValidName(): Promise<boolean> {
        // Check name uniqueness
        const given_name = this.plot.name;

        if (!given_name) {
            this.messageManager.sendError("Invalid Plot Name", "Name must not be empty");
            return false;
        }

        if (this.pyrequest.plotList.some((plot) => plot !== this.plot && plot.name === given_name)) {
            this.messageManager.sendError("Invalid Plot Name", "Name must be unique");
            return false;
        }

        return true;
    }

    async isValidDataSlot(fieldName: string): Promise<boolean> {
        // Check if the data slot is valid
        const dataSlot = this.plot.dataSlot;

        if (!dataSlot) {
            this.messageManager.sendError("Critical Error", "Data Slot not found");
        }

        // For each field name on PyDataSlot, check if the given field name is valid
        for (const field in dataSlot) {
            if (field === fieldName) {
                // Check if dataName exists among the dataList
                const dataName = dataSlot[field].name;
                const dataExists = this.pyrequest.dataList.some((data) => data.name === dataName);

                if (!dataExists) {
                    this.messageManager.sendError("Invalid Data Slot", `Data "${dataName}" not found`);
                    return false;
                }
            }
        }

        return true;
    }

    async validate(): Promise<boolean> {
        const name = await this.isValidName();

        // todo

        return name;
    }
}


export class PyRequestValidator extends PyValidator {
    constructor(
        protected messageManager: MessageManager,
        protected pyrequest: PyRequest
    ) {
        super(messageManager);
    }

    async isValidDataList(): Promise<boolean> {
        const dataList = this.pyrequest.dataList;

        // check each dataElement in dataList
        const validationPromises = dataList.map(async (data) => {
            const validator = new PyDataValidator(this.messageManager, data, this.pyrequest);
            return await validator.validate();
        });

        const validationResults = await Promise.all(validationPromises);

        if (validationResults.some(isValid => !isValid)) {
            return false;
        }

        return true;
    }

    async isValidPlotList(): Promise<boolean> {
        const plotList = this.pyrequest.plotList;

        // check each plotElement in plotList
        for (const plot of plotList) {
            const validator = new PyPlotValidator(this.messageManager, plot, this.pyrequest);
            const isValid = await validator.validate();

            if (!isValid) {
                return false;
            }
        }

        return true;
    }

    async validate(): Promise<boolean> {
        const data = await this.isValidDataList();
        const plot = await this.isValidPlotList();

        return data && plot;
    }
}