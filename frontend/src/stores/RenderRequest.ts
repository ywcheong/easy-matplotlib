import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import Ajv from 'ajv';
import schema from '@/schema/RenderRequest.schema.json'
import FormPlotDisplay from '@/components/form/FormPlotDisplay.vue';

// =====================================================
//   Figure
// =====================================================

interface BaseStyle {
    style_name: string | null;
}


// =====================================================
//   Figure
// =====================================================

interface FigureSize {
    row: number;
    column: number;
}

interface FigureStyle extends BaseStyle {
    code_indent_style?: 'space' | 'tab';
    code_is_function?: boolean;
    // todo
}

interface Figure {
    size: FigureSize;
    axes: (string | null)[][];
    style: FigureStyle;
}

// =====================================================
//   Axes
// =====================================================

interface AxesStyle extends BaseStyle {
    // todo
}

interface AxesElement {
    name: string;
    plot: string[];
    style: AxesStyle;
}

// =====================================================
//   Data
// =====================================================

interface DataElement {
    name: string;
    value: number[];
    value_text?: string;
}

// =====================================================
//   Plot.Data Format
// =====================================================

type PlotType = 'plot' | 'bar' | 'imshow' | 'contour' | 'pcolormesh' | 'pie' | 'fill';
type PlotDataOption = 'required' | 'optional';

const PLOT_DEFINITION: { [key in PlotType]: { [key: string]: PlotDataOption } } = {
    plot: {
        x: 'optional',
        y: 'required',
    },
    bar: {
        x: 'optional',
        height: 'required',
    },
    imshow: {
        z: 'required'
    },
    contour: {
        x: 'optional',
        y: 'optional',
        z: 'required'
    },
    pcolormesh: {
        x: 'optional',
        y: 'optional',
        z: 'required'
    },
    pie: {
        z: 'required'
    },
    fill: {
        x: 'required',
        y1: 'required',
        y2: 'required'
    }
};

class PlotData {
    plot_type: PlotType;
    member_data: { [key: string]: string };

    constructor(plot_type: PlotType) {
        this.plot_type = plot_type;
        this.member_data = {};

        const members = this.getMembers();
        for (const i in members) {
            this.member_data[members[i]] = '';
        }

        console.log(this.member_data);
    }
    // getMembers: return required and not-required fields of datas for each plot_type
    // ex. { x: 'optional', y: 'required' }
    getMembers(): string[] {
        return Object.keys(PLOT_DEFINITION[this.plot_type]);
    }

    getMemberData(key: string): string {
        return this.member_data[key];
    }

    isMemberRequired(key: string): boolean {
        return PLOT_DEFINITION[this.plot_type][key] == 'required';
    }

    // setMembers: get one of getmembers as key, and set value as DataElement.name and store it
    // ex. setMembers('x', 'data1')
    setMemberAs(member_name: string, data_name: string) {
        this.member_data[member_name] = data_name;
    }

    // isValid: check if every required fields are complete
    isValid(): boolean {
        const members = this.getMembers();
        for (const key in members) {
            if (members[key] == 'required' && !(key in this.member_data)) {
                return false;
            }
        }
        return true;
    }
}

class SimplePlotStyle implements PlotStyle {
    style_name: string | null;
    linestyle: 'solid' | 'dashed' | 'dashdot' | 'dotted' | 'none';

    constructor() {
        this.style_name = null;
        this.linestyle = 'solid';
    }
}

export class PlotElement {
    name: string;
    data: PlotData;
    style: PlotStyle;

    constructor() {
        this.name = '';
        this.data = new PlotData('plot');
        this.style = new SimplePlotStyle();
    }
}

// =====================================================
//   Plot
// =====================================================

interface PlotStyle extends BaseStyle {
    linestyle?: 'solid' | 'dashed' | 'dashdot' | 'dotted' | 'none';
    // todo
}

// =====================================================
//   RenderRequest
// =====================================================

interface RenderRequest {
    request_id: string;
    figure: Figure;
    axes: AxesElement[];
    plot: PlotElement[];
    data: DataElement[];
}

export const useRenderRequestStore = defineStore('renderRequest', () => {
    const renderRequest = ref<RenderRequest>({
        request_id: '',
        figure: {
            size: { row: 1, column: 1 },
            axes: [[]],
            style: { style_name: null }
        },
        axes: [] as AxesElement[],
        plot: [] as PlotElement[],
        data: [] as DataElement[]
    });

    // Getters
    const getFigure = computed(() => renderRequest.value.figure);
    const getAxes = computed(() => renderRequest.value.axes);
    const getPlot = computed(() => (renderRequest.value.plot as PlotElement[]));
    const getData = computed(() => renderRequest.value.data);

    // Actions
    function initializeRenderRequest() {
        renderRequest.value.request_id = uuidv4();
    }

    function exportJSON(): string {
        return JSON.stringify(renderRequest.value);
    }

    function verifySchema(): string[] {
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(renderRequest.value);

        if (valid) {
            return [];
        } else {
            return validate.errors?.map(error => `${error.instancePath} ${error.message}`) || [];
        }
    }

    function getDataNames(): string[] {
        return renderRequest.value.data.map(d => d.name);
    }

    function getPlotNames(): string[] {
        return renderRequest.value.plot.map(p => p.name);
    }

    function getAxesNames(): string[] {
        return renderRequest.value.axes.map(a => a.name);
    }

    function addEmptyAxes() {
        // todo
        renderRequest.value.axes.push({
            name: '',
            plot: [],
            style: { style_name: null }
        });
    }

    function addEmptyPlot(plot_type: PlotType) {
        renderRequest.value.plot.push({
            name: '',
            data: new PlotData(plot_type),
            style: { style_name: null }
        });
    }

    function addEmptyData() {
        renderRequest.value.data.push({
            name: '',
            value: []
        });
    }

    function deleteAxes(index: number) {
        if (index >= 0 && index < renderRequest.value.axes.length) {
            renderRequest.value.axes.splice(index, 1);
        }
    }

    function deletePlot(index: number) {
        if (index >= 0 && index < renderRequest.value.plot.length) {
            renderRequest.value.plot.splice(index, 1);
        }
    }

    function deleteData(index: number) {
        if (index >= 0 && index < renderRequest.value.data.length) {
            renderRequest.value.data.splice(index, 1);
        }
    }

    // add one dummy data
    addEmptyData();

    return {
        renderRequest,
        getFigure,
        getAxes,
        getPlot,
        getData,
        initializeRenderRequest,
        exportJSON,
        verifySchema,
        getDataNames,
        getPlotNames,
        getAxesNames,
        addEmptyAxes,
        addEmptyPlot,
        addEmptyData,
        deleteAxes,
        deletePlot,
        deleteData
    };
});
