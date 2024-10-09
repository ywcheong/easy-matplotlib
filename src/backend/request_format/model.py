# https://realpython.com/python-pydantic
# ^ helpful link

import collections
import itertools
import uuid

from typing import List, Optional, Literal, Union, Any
from pydantic import (
    BaseModel,  # Base class
    ConfigDict,  # Configuration class
    ValidationInfo,  # For multi-field validation
    Field,  # For simple validation
    field_validator,  # For complex single validation
    model_validator,  # For complex overall validation
)

#################################################################
#   Reject - Exception
#################################################################


class CodeReject(Exception):
    def __init__(self, message):
        self.message = message


#################################################################
#   Figure
#################################################################


class FigureSize(BaseModel):
    model_config = ConfigDict(extra="forbid")
    row: int = Field(gt=0)
    column: int = Field(gt=0)


class FigureStyle(BaseModel):
    model_config = ConfigDict(extra="forbid")
    style_name: Optional[str]  # debug purpose attribute - not used


class Figure(BaseModel):
    model_config = ConfigDict(extra="forbid")
    size: FigureSize
    axes: List[List[Optional[str]]]
    style: FigureStyle

    # Check if Figure.axes.shape == (Figure.size.row, Figure.size.column)
    @model_validator(mode="after")
    def check_axes_dimension(self):
        row, column = self.size.row, self.size.column

        # check row-shape equality
        if row != len(self.axes):
            raise CodeReject(
                "Shape of figure.axes is not equivalent to the provided (row, column)"
            )

        # check column-shape equality
        for axes_row in self.axes:
            if column != len(axes_row):
                raise CodeReject(
                    "Shape of figure.axes is not equivalent to the provided (row, column)"
                )

        return self


#################################################################
#   Axes
#################################################################


class AxesStyle(BaseModel):
    model_config = ConfigDict(extra="forbid")
    style_name: Optional[str]  # debug purpose attribute - not used


class AxesElement(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    plot: List[str]
    style: AxesStyle


#################################################################
#   Plot.Data Format
#################################################################


class PlotData(BaseModel):
    relation: str
    model_config = ConfigDict(extra="forbid")


class SimplePlotData(PlotData):
    relation: Literal["simple-plot"]
    x: str
    y: str


PlotDataSupported = Union[SimplePlotData]

#################################################################
#   Plot
#################################################################


class PlotStyle(BaseModel):
    model_config = ConfigDict(extra="forbid")
    style_name: Optional[str]  # debug purpose attribute - not used


class PlotElement(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    data: PlotDataSupported = Field(discriminator="relation")
    style: PlotStyle


#################################################################
#   Data
#################################################################


class DataElement(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    value: List[float]


#################################################################
#   Request
#################################################################


class RequestElement(BaseModel):
    model_config = ConfigDict(extra="forbid")
    request_id: uuid.UUID
    figure: Figure
    axes: List[AxesElement]
    plot: List[PlotElement]
    data: List[DataElement]

    @classmethod
    def get_duplicate_list(cls, L: List[str]):
        return [item for (item, count) in collections.Counter(L).items() if (count > 1)]

    # Check if every (axes[].name, plot[].name, data[].name) unique
    @field_validator("axes", "plot", "data")
    @classmethod
    def check_uniqueness(cls, attr: List[Any], info: ValidationInfo) -> Any:
        attr_names = [at.name for at in attr]
        duplicative_attr_names = cls.get_duplicate_list(attr_names)

        if len(duplicative_attr_names) > 0:
            raise CodeReject(
                f"Duplicative {info.field_name} name found: {duplicative_attr_names}"
            )

        return attr

    @field_validator("axes")
    @classmethod
    def check_axes_name_uniqueness(cls, axes: List[AxesElement]) -> List[AxesElement]:
        axes_names = [ax.name for ax in axes]
        duplicative_axes_names = cls.get_duplication(axes_names)

        if len(duplicative_axes_names) > 0:
            raise CodeReject(f"Duplicative axes name defined: {duplicative_axes_names}")

        return axes

    # check if figure.axes[] has corresponding axes name
    @model_validator(mode="after")
    def check_figure_has_valid_axes(self):
        # get every existing axes name
        axes_names = [ax.name for ax in self.axes]

        for i, j in itertools.product(self.figure.size.row, self.figure.size.column):
            figure_axes = self.figure.axes[i][j]
            if (figure_axes is not None) and (figure_axes not in axes_names):
                raise CodeReject(
                    f"Cannot find figure.axes[{i}][{j} = '{figure_axes}' in axes names"
                )

        return self

    # subfunction for self.check_axes_has_valid_plot
    def lookup_single_axes(self, axes_element: AxesElement, plot_names: List[str]):
        for plt in axes_element.plot:
            if plt not in plot_names:
                raise CodeReject(
                    f"Cannot find plot '{plt}' from axes {axes_element.name} in plot names"
                )

    # check if axes.plot[] has corresponding plot name
    @model_validator(mode="after")
    def check_axes_has_valid_plot(self):
        # get every existing plot name
        plot_names = [plt.name for plt in self.plot]

        for axes_element in self.axes:
            self.lookup_single_axes(axes_element, plot_names)

        return self

    # subfunction for self.check_plot_has_valid_data
    def lookup_single_plot(plot_element: PlotElement, data_names: List[str]):
        # get declared data from plot element
        using_data_element = plot_element.data

        # extract data keys, except for 'relation'
        using_data_keys = set(using_data_element.__dict__.keys()) - set("relation")

        # convert data key into values, to get using data names
        using_data_names = set(
            using_data_element.__dict__[key] for key in using_data_keys
        )

        # check if (using data names) is subset of (data names)
        if not using_data_names <= set(data_names):
            unknown_data = using_data_names - set(data_names)
            raise CodeReject(
                f"Cannot find data {unknown_data} from plot {plot_element.name} in data names"
            )

    # check if plot[].data.(!relation) has corresponding data name
    @model_validator(mode="after")
    def check_plot_has_valid_data(self):
        # get every existing data name
        data_names = [dt.name for dt in self.data]

        for plot_element in self.plot:
            self.lookup_single_plot(plot_element, data_names)

        return self
