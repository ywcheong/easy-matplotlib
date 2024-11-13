import { PyPlotStyle, PyPlotStyleLine, PyPlotStyleScatter } from './entities.style';
import { PyDataSlot, PyDataSlotLine, PyDataSlotScatter } from './entities.dataslot';

// Data
export class PyData {
    name: string;
    value: string;
    valueShape: number[];

    constructor() {
        this.name = "";
        this.value = "";
        this.valueShape = [];
    }
}

// Plot Style Factory
export type PyPlotType = 'line' | 'scatter';

export class PyPlotDataSlotFactory {
    static createPlotDataSlot(plotType: PyPlotType): PyDataSlot {
        switch (plotType) {
            case "line":
                return new PyDataSlotLine();
            case "scatter":
                return new PyDataSlotScatter();
        }
    }
}

export class PyPlotStyleFactory {
    static createPlotStyle(plotType: PyPlotType): PyPlotStyle {
        switch (plotType) {
            case "line":
                return new PyPlotStyleLine();
            case "scatter":
                return new PyPlotStyleScatter();
        }
    }
}

// Plot
export class PyPlot {
    plotType: string;
    name: string;
    dataSlot: PyDataSlot;
    style: PyPlotStyle;

    constructor(plotType: PyPlotType) {
        this.plotType = plotType;
        this.name = "";
        this.dataSlot = PyPlotDataSlotFactory.createPlotDataSlot(plotType);
        this.style = PyPlotStyleFactory.createPlotStyle(plotType);
    }

    getDescriptiveType() {
        switch (this.plotType) {
            case "line":
                return "Line Plot";
            case "scatter":
                return "Scatter Plot";
        }
    }
}

// Request
export class PyRequest {
    dataList: PyData[] = [];
    plotList: PyPlot[] = [];

    constructor() {}
}