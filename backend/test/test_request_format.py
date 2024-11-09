import pytest
from pydantic import ValidationError

from src.request_format import RequestElement
from src.request_format.model import PlotElement, SimplePlotData, PlotStyle
from .test_helper import TestHelper


@pytest.mark.parametrize("filename", TestHelper.success())
def test_success_model(filename):
    json_object = TestHelper.load_testcase(filename)
    request_content = RequestElement.model_validate(json_object)


@pytest.mark.parametrize("filename", TestHelper.fail())
def test_fail_model(filename):
    json_object = TestHelper.load_testcase(filename)
    with pytest.raises(ValidationError):
        request_content = RequestElement.model_validate(json_object)


@pytest.mark.parametrize("filename", TestHelper.invalid())
def test_invalid_model(filename):
    json_object = TestHelper.load_testcase(filename)
    with pytest.raises(ValidationError):
        request_content = RequestElement.model_validate(json_object)


def test_plot_tocode():
    plot = PlotElement(
        name="default_plot_0",
        data=SimplePlotData(relation="plot", x="x", y="y1"),
        style=PlotStyle(style_name="style-value", linestyle="solid"),
    )
    assert plot.to_code() == "plot(data_x, data_y1, linestyle='solid')"
