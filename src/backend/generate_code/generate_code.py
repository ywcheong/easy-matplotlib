# ----- step 1. configure figure/axes [Figure]
# fig, axes = plt.subplot(n, m)
#
# ----- step 2. data declare [Data]
# x = [....]
# y = [....]
#
# ----- step 3-1. design plot [Plot]
# plot(x, y, style)
#
# ----- step 3-2. assign plot to axes [Axes]
# axes.plot(x, y, style)
#
# ----- step

from typing import List
from ..request_format.model import RequestElement

INITIAL_CODELINE = ["import numpy as np", "import matplotlib.pyplot as plt"]


class UnlinkedPlot:
    plot_name: str
    line: str


def request_into_model(request_json_string: str) -> RequestElement:
    # Can raise ValidationError, CodeReject
    return RequestElement.model_validate_json(request_json_string)


def generate_figure_lines(request_model: RequestElement):
    row, column = request_model.figure.size.row, request_model.figure.size.column
    return [f"fig, axes = plt.subplots({row}, {column})"]


def generate_data_lines(request_model: RequestElement):
    lines = []
    for data in request_model.data:
        lines.append(f"data_{data.name} = {data.value}")
    return lines


def generate_unlinked_plot(request_model: RequestElement) -> List[UnlinkedPlot]:
    unlinked_plot: List[UnlinkedPlot] = []
    for plot in request_model.plot:
        uplot = UnlinkedPlot(plot_name=plot.name, line=plot.compile())
        unlinked_plot.append(uplot)
    return unlinked_plot


def link_axes_to_plot(request_model: RequestElement, plot_code_lines):
    pass


def merge_lines(figure_code_lines, data_code_lines, axes_plot_code_lines):
    pass


def request_into_code(request_json_string: str):
    # parse request JSON string into request model
    request_model: RequestElement = request_into_model(request_json_string)

    # get each lines from request model
    figure_lines = generate_figure_lines(request_model)
    data_lines = generate_data_lines(request_model)

    plot_unlinked_lines = generate_unlinked_plot(request_model)
    axes_plot_lines = link_axes_to_plot(request_model, plot_unlinked_lines)

    # merge code lines
    code_lines = merge_lines(figure_lines, data_lines, axes_plot_lines)

    return code_lines
