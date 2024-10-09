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

import json
import pydantic

from ..request_format.model import RequestElement, CodeReject

INITIAL_CODELINE = ["import numpy as np", "import matplotlib.pyplot as plt"]


def request_into_model(request_string: str):
    try:
        return RequestElement.model_validate_json(request_string)
    except pydantic.ValidationError as e:
        raise CodeReject(e)

def generate_figure_axes(request_json):
    pass


def generate_data(request_json):
    pass


def generate_plot(request_json):
    pass


def link_axes_to_plot(request_json, plot_code_lines):
    pass


def combine_codes(figure_code_lines, data_code_lines, axes_plot_code_lines):
    pass


def request_to_code(request_string: str):
    # parse request string into json
    request_json = request_into_model(request_string)

    # generate figure/axes definition
    figure_code_lines = generate_figure_axes(request_json)

    # generate data definition
    data_code_lines = generate_data(request_json)

    # generate plot (not linked with axes)
    plot_code_lines = generate_plot(request_json)

    # link plot with axes
    axes_plot_code_lines = link_axes_to_plot(request_json, plot_code_lines)

    # combine code lines
    code_lines = combine_codes(figure_code_lines, data_code_lines, axes_plot_code_lines)

    return code_lines