import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { directToast } from "@/utility/toast"

// =====================================================
//   Data
// =====================================================

export class DataElement {
    // Key information
    name: string;
    value: string;

    // Sub information
    valueShape: number[];

    constructor() {
        this.name = "";
        this.value = "";
        this.valueShape = [0];
    }

    isValid() {
        return this.name !== "" && this.value.length > 0;
    }

    toString() {
        return `DataElement[${this.name}=${this.value}]`;
    }

    verifyName(dataList: DataElement[]) {
        if (!this.name) {
            return false;
        }

        if (dataList.some((data) => data !== this && data.name === this.name)) {
            directToast.error('Invalid Name', 'Name must be unique');
            this.name = "";
            return false;
        }

        return true;
    }

    verifyValue(): boolean {
        let given_text = this.value;

        if (!given_text) {
            this.value = "";
            this.valueShape = [0];
            return false;
        }

        // Check if the cleaned text is a list
        if (!given_text.startsWith("[") || !given_text.endsWith("]")) {
            given_text = `[${given_text}]`;
        }

        const cleanedText = given_text.replace(/\s+/g, ' ').trim();

        // Check if the cleaned text follows the Python List[Union[float, int]] style
        try {
            const parsed = JSON.parse(cleanedText);

            if (Array.isArray(parsed)) {
                const is1DArray = parsed.every((item) => typeof item === 'number');
                const is2DArray = parsed.every((item) => Array.isArray(item) && item.every((subItem) => typeof subItem === 'number'));

                if (is1DArray) {
                    this.value = cleanedText;
                    this.valueShape = [parsed.length];
                    return true;
                } else if (is2DArray) {
                    const firstRowLength = parsed[0].length;
                    const isRectangular = parsed.every((row) => row.length === firstRowLength);

                    if (isRectangular) {
                        this.value = cleanedText;
                        this.valueShape = [parsed.length, firstRowLength];
                        return true;
                    } else {
                        directToast.error('Invalid Data', 'Data must be a rectangular 2D array');
                    }
                } else {
                    directToast.error('Invalid Data', 'Data must be a 1D or 2D array of numbers');
                }
            }
        } catch (e) {
            // JSON parsing failed, not a valid list
            directToast.error('Invalid Data', 'Data must be a 1D or 2D array of numbers');
        }

        // nonvalid values would be terminated at here
        this.value = "";
        this.valueShape = [0];
        return false;

    }
}

export class DataList {
    list: DataElement[];

    constructor() {
        this.list = [];
    }

    addNewElement() {
        this.list.push(new DataElement());
    }

    removeDataElement(index: number) {
        if (index < 0 || index >= this.list.length) {
            console.error("Invalid index");
            return;
        }

        // todo check reference

        this.list.splice(index, 1);
    }

    getDataNames() {
        return this.list.map((data) => data.name);
    }
}

// =====================================================
//   Plot
// =====================================================

type PlotType = 'plot' | 'scatter' | 'bar' | 'imshow'
    | 'contour' | 'pcolormesh' | 'pie' | 'fill';

export class PlotElement {
    plotType: PlotType;
    name: string;
    data: DataElement;

    constructor(plotType: PlotType) {
        this.plotType = plotType;
        this.name = "";
        this.data = new DataElement();
    }
}

export class PlotStyleElement {
    styleName: string;
    styleValue: string;

    constructor(styleName: string, styleValue: string) {
        this.styleName = styleName;
        this.styleValue = styleValue;
    }
}

export class PlotList {
    list: PlotElement[];

    constructor() {
        this.list = [];
    }

    addNewElement(plotType: PlotType) {
        this.list.push(new PlotElement(plotType));
    }

    removePlotElement(index: number) {
        if (index < 0 || index >= this.list.length) {
            console.error("Invalid index");
            return;
        }

        // todo check reference

        this.list.splice(index, 1);
    }

    getPlotNames() {
        return this.list.map((plot) => plot.name);
    }
}

export class RequestPack {
    data: DataList;

    constructor() {
        this.data = new DataList();
    }
}

export const useRequestPack = defineStore('RequestPack', () => {
    const request_pack = ref<RequestPack>(new RequestPack());

    const getDataList = computed(() => request_pack.value.data);

    return {
        request_pack,
        getDataList,
    };
});