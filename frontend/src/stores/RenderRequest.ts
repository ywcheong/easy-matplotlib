import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import Ajv from 'ajv';
import schema from '@/schema/RenderRequest.schema.json'

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
    raw_value?: string;
}

// =====================================================
//   Plot.Data Format
// =====================================================

type PlotRelation = 'plot' | 'scatter';
type BasePlotData = SimplePlotData;

interface SimplePlotData {
    relation: 'plot';
    x: string;
    y: string;
}

// =====================================================
//   Plot
// =====================================================

interface PlotStyle extends BaseStyle {
    linestyle?: 'solid' | 'dashed' | 'dashdot' | 'dotted' | 'none';
    // todo
}

interface PlotElement {
    name: string;
    data: BasePlotData;
    style: PlotStyle;
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
        axes: [],
        plot: [],
        data: []
    });

    // Getters
    const getFigure = computed(() => renderRequest.value.figure);
    const getAxes = computed(() => renderRequest.value.axes);
    const getPlot = computed(() => renderRequest.value.plot);
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

    function addEmptyPlot(plot_type: PlotRelation) {
        if (plot_type == 'plot'){
            // Simple Plot
            renderRequest.value.plot.push({
                name: '',
                data: {
                    relation: 'plot',
                    x: '',
                    y: '',
                },
                style: { style_name: null }
            });
        }
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
