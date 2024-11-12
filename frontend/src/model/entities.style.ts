// Plot - style
type PyColor = string; // or any other appropriate type
type PySize = number; // or any other appropriate type

const PY_COLOR_DEFAULT: PyColor = '#000000';
const PY_SIZE_DEFAULT: PySize = 1;

export abstract class PyPlotStyle { }

export class PyPlotStyleLine extends PyPlotStyle {
    line_color: PyColor = PY_COLOR_DEFAULT;
    marker_color: PyColor = PY_COLOR_DEFAULT;
    line_size: PySize = PY_SIZE_DEFAULT;
    marker_size: PySize = PY_SIZE_DEFAULT;

    constructor() {
        super();
    }
}

export class PyPlotStyleScatter extends PyPlotStyle {
    color: PyColor = PY_COLOR_DEFAULT;
    size: PySize = PY_SIZE_DEFAULT;

    constructor() {
        super();
    }
}