import { PyData, PyPlot, PyRequest } from "@/model/entities";
import { PyRequestValidator } from "./validator";
import { MessageManager, ConsoleMessageChannel } from "./message";
import { Buffer } from "buffer";

export type JSON = string;
export type Base64 = string;

export class GlobalTranslator {
    static async JSONToPyRequest(givenJSON: JSON): Promise<PyRequest> {
        let parsedJSON: any;

        try {
            // Parse JSON string
            parsedJSON = JSON.parse(givenJSON as string);
        } catch (error) {
            // Invalid JSON format
            throw new Error("Invalid JSON format");
        }

        if (!Array.isArray(parsedJSON.dataList) || !Array.isArray(parsedJSON.plotList)) {
            // Invalid PyRequest structure
            throw new Error("Invalid PyRequest structure");
        }

        const pyRequest = new PyRequest();
        pyRequest.dataList = parsedJSON.dataList.map((data: any) => {
            if (typeof data.name !== 'string' || typeof data.value !== 'string') {
                throw new Error("Invalid PyData structure");
            }

            const pyData = new PyData();
            pyData.name = data.name;
            pyData.value = data.value;
            pyData.valueShape = []; // ignore valueShape, since PyRequestValidator will validate it
            return pyData;
        });

        pyRequest.plotList = parsedJSON.plotList.map((plot: any) => {
            if (typeof plot.name !== 'string' || typeof plot.plotType !== 'string') {
                throw new Error("Invalid PyPlot structure");
            }
            const pyPlot = new PyPlot(plot.plotType);
            pyPlot.name = plot.name;
            // TODO: dataSlot and style // after PyPlot implementation
            return pyPlot;
        });

        // validate pyRequest
        const messageManager = new MessageManager();
        messageManager.addChannel(new ConsoleMessageChannel());
        const validator = new PyRequestValidator(messageManager, pyRequest);
        const isValid = await validator.validate();

        if (!isValid) {
            throw new Error("Invalid PyRequest");
        }

        return pyRequest;
    }

    static async PyRequestToJSON(givenRequest: PyRequest): Promise<string> {
        const dataList = givenRequest.dataList.map((data) => {
            return {
                name: data.name,
                value: data.value
            };
        });

        const plotList = givenRequest.plotList.map((plot) => {
            return {
                name: plot.name,
                plotType: plot.plotType
            };
        });

        const pyRequest = {
            dataList,
            plotList
        };

        return JSON.stringify(pyRequest);
    }

    static async PyRequestToExecutable(givenRequest: PyRequest): Promise<string[]> {
        return [] as string[];
    }

    static async JSONToBase64(givenJSON: JSON): Promise<Base64> {
        // given JSON string, convert to web-safe base64
        const base64 = Buffer.from(givenJSON).toString('base64');
        return base64.replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    }

    static async Base64ToJSON(givenBase64: Base64): Promise<JSON> {
        // given web-safe base64, convert to JSON string
        const base64 = givenBase64.replace(/-/g, '+')
            .replace(/_/g, '/');
        const json = Buffer.from(base64, 'base64').toString('utf-8');
        return json;
    }
}