# https://realpython.com/python-pydantic
# ^ helpful link

import collections
import itertools
import uuid
import keyword

from typing import List, Optional, Literal, Union, Any, Annotated
from pydantic import (
    BaseModel,
    ConfigDict,
    ValidationInfo,
    Field,
    field_validator,
    model_validator,
)
from pydantic.functional_validators import AfterValidator


#################################################################
#   Safe Identifier for String-instead
#################################################################


def validate_safe_identifier(given_name: str) -> str:
    """
    For names in ``RequestElement``. Safe to use as Python identifier.
    """
    given_name = given_name.replace("-", "_")
    if not given_name.isidentifier():
        raise AssertionError(
            f"Name '{given_name}' is too dangerous to use as an identifier in Python"
        )
    elif keyword.iskeyword(given_name):
        raise AssertionError(f"Name '{given_name}' is Python-reserved keyword")
    return given_name


def attach_axes(given_name: str) -> str:
    return "axes_" + given_name


def attach_data(given_name: str) -> str:
    return "data_" + given_name


SafeIndentifier = Annotated[str, AfterValidator(validate_safe_identifier)]
SafeAxesIndentifier = Annotated[
    str, AfterValidator(attach_axes), AfterValidator(validate_safe_identifier)
]
SafeDataIndentifier = Annotated[
    str, AfterValidator(attach_data), AfterValidator(validate_safe_identifier)
]

#################################################################
#   Styles
#################################################################


class BaseStyle(BaseModel):
    model_config = ConfigDict(extra="forbid")
    style_name: Optional[SafeIndentifier]  # debug purpose attribute - not used

    def get_style_dict(self):
        result = dict()
        style_name_list = set(self.__dict__.keys()) - {"style_name"}
        for param_name in style_name_list:
            result[param_name] = self.__dict__[param_name]
        return result


#################################################################
#   Figure
#################################################################


class FigureSize(BaseModel):
    model_config = ConfigDict(extra="forbid")
    row: int = Field(gt=0)
    column: int = Field(gt=0)


class FigureStyle(BaseStyle):
    code_indent_style: Optional[Literal["space", "tab"]] = Field(default="space")
    code_is_function: Optional[bool] = Field(default=True)


class Figure(BaseModel):
    model_config = ConfigDict(extra="forbid")
    size: FigureSize
    axes: List[List[Optional[SafeAxesIndentifier]]]
    style: FigureStyle

    @model_validator(mode="after")
    def check_axes_dimension(self):
        """Check if `shapeof(Figure.axes) == (Figure.size.row, Figure.size.column)`"""
        row, column = self.size.row, self.size.column

        # check row-shape equality
        if row != len(self.axes):
            raise AssertionError(
                "Shape of figure.axes is not equivalent to the provided (row, column)"
            )

        # check column-shape equality
        for axes_row in self.axes:
            if column != len(axes_row):
                raise AssertionError(
                    "Shape of figure.axes is not equivalent to the provided (row, column)"
                )

        return self


#################################################################
#   Axes
#################################################################


class AxesStyle(BaseStyle):
    pass


class AxesElement(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: SafeAxesIndentifier
    plot: List[SafeIndentifier]
    style: AxesStyle


#################################################################
#   Plot.Data Format
#################################################################


def concat_data(*args):
    return ", ".join([arg for arg in args if arg is not None])


class BasePlotData(BaseModel):
    """
    Base class for RequestElement.data[]
    """

    relation: SafeIndentifier
    model_config = ConfigDict(extra="forbid")

    def to_code(self):
        """ """
        raise NotImplementedError(
            "BasePlotData is abstract class, call its implementation instead"
        )

    def get_param_data_dict(self):
        result = dict()
        param_name_list = set(self.__dict__.keys()) - {"relation"}
        for param_name in param_name_list:
            result[param_name] = self.__dict__[param_name]
        return result


class SimplePlotData(BasePlotData):
    """
    PlotData for .plot() rendering
    """

    relation: Literal["plot"]
    x: SafeDataIndentifier
    y: SafeDataIndentifier

    def to_code(self):
        return concat_data(self.x, self.y)


PlotDataSupported = Union[SimplePlotData]

#################################################################
#   Plot
#################################################################

plot_linestyle = Literal["solid", "dashed", "dashdot", "dotted", "none"]


class PlotStyle(BaseStyle):
    linestyle: plot_linestyle = Field(default="solid")


class PlotElement(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: SafeIndentifier
    data: PlotDataSupported = Field(discriminator="relation")
    style: PlotStyle

    def to_code(self) -> str:
        """Convert PlotElement into executable code (without plot link)"""
        arguments = []

        # retrieve data-parameter
        arguments.append(self.data.to_code())

        # retrieve style-parameter
        style_dict = self.style.get_style_dict()
        for style_name in style_dict:
            style_value = style_dict[style_name]
            arguments.append(f"{style_name}='{style_value}'")

        # combine into one line
        arguments_fragment = ", ".join(arguments)
        return f"{self.data.relation}({arguments_fragment})"


#################################################################
#   Data
#################################################################


class DataElement(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: SafeDataIndentifier
    value: List[float]


#################################################################
#   Request
#################################################################


class RequestElement(BaseModel):
    """
    ER Relation
    * Figure.axes <-0..1 / 0..1-> Axes
    * Axes.plot   <-0..N / 0..N-> Plot
    * Plot.data   <-1..1 / 0..N-> Data
    """

    model_config = ConfigDict(extra="forbid")
    request_id: uuid.UUID
    figure: Figure
    axes: List[AxesElement]
    plot: List[PlotElement]
    data: List[DataElement]

    @classmethod
    def get_duplicate_list(cls, L: List[str]):
        return [item for (item, count) in collections.Counter(L).items() if (count > 1)]

    @field_validator("axes", "plot", "data")
    @classmethod
    def check_uniqueness(
        cls,
        attr: List[Union[AxesElement, PlotElement, DataElement]],
        info: ValidationInfo,
    ) -> Any:
        """Check if every (axes[].name, plot[].name, data[].name) is unique"""
        attr_names = [at.name for at in attr]
        duplicative_attr_names = cls.get_duplicate_list(attr_names)

        if len(duplicative_attr_names) > 0:
            raise AssertionError(
                f"Duplicative {info.field_name} name found: {duplicative_attr_names}"
            )

        return attr

    @model_validator(mode="after")
    def check_figure_has_valid_axes(self):
        """Check if every figure.axes[][] is valid Axes[].name"""
        # get every existing axes name
        axes_names = [ax.name for ax in self.axes]

        for i, j in itertools.product(
            range(self.figure.size.row), range(self.figure.size.column)
        ):
            axes_name = self.figure.axes[i][j]
            if (axes_name is not None) and (axes_name not in axes_names):
                raise AssertionError(
                    f"Cannot find figure.axes[{i}][{j}] = '{axes_name}' in axes names"
                )

        return self

    def lookup_single_axes(self, axes_element: AxesElement, plot_name_list: List[str]):
        """subfunction for self.check_axes_has_valid_plot"""
        for plot_name in axes_element.plot:
            if plot_name not in plot_name_list:
                raise AssertionError(
                    f"Cannot find plot '{plot_name}' from axes {axes_element.name} in plot names"
                )

    @model_validator(mode="after")
    def check_axes_has_valid_plot(self):
        """Check if every axes[].plot is valid plot[].name"""
        # get every existing plot name
        plot_names = [plt.name for plt in self.plot]

        for axes_element in self.axes:
            self.lookup_single_axes(axes_element, plot_names)

        return self

    def lookup_single_plot(self, plot_element: PlotElement, data_name_list: List[str]):
        """subfunction for self.check_plot_has_valid_data"""
        # get plot's using data name references
        using_data_names = set(plot_element.data.get_param_data_dict().values())

        # check if (using data names) is subset of (data names)
        if not using_data_names <= set(data_name_list):
            unknown_data = using_data_names - set(data_name_list)
            raise AssertionError(
                f"Cannot find data {unknown_data} from plot {plot_element.name} in data names"
            )

    @model_validator(mode="after")
    def check_plot_has_valid_data(self):
        """check if every plot[].data is valid data[].name"""
        # get every existing data name
        data_names = [dt.name for dt in self.data]

        for plot_element in self.plot:
            self.lookup_single_plot(plot_element, data_names)

        return self
