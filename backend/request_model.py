# https://realpython.com/python-pydantic
# ^ helpful link

from typing import List, Optional, Literal, Union
from pydantic import (
    BaseModel,  # Base class
    ConfigDict,  # Configuration class
    Field,      # For simple validation
    field_validator,  # For complex single validation
    model_validator,  # For complex overall validation
)

from uuid import UUID

#################################################################
#   Figure
#################################################################

class FigureSize(BaseModel):
    model_config = ConfigDict(extra="forbid")
    row: int = Field(gt=0)
    column: int = Field(gt=0)

class FigureStyle(BaseModel):
    model_config = ConfigDict(extra="forbid")
    style_name: Optional[str]   # debug purpose attribute - not used

class Figure(BaseModel):
    model_config = ConfigDict(extra="forbid")
    size: FigureSize
    axes: List[List[Optional[str]]]
    style: FigureStyle

#################################################################
#   Axes
#################################################################

class AxesStyle(BaseModel):
    model_config = ConfigDict(extra="forbid")
    style_name: Optional[str]   # debug purpose attribute - not used

class Axes(BaseModel):
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
    style_name: Optional[str]   # debug purpose attribute - not used

class Plot(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    data: PlotDataSupported = Field(discriminator="relation")
    style: PlotStyle

#################################################################
#   Data
#################################################################

class Data(BaseModel):
    model_config = ConfigDict(extra="forbid")
    name: str
    value: List[float]

#################################################################
#   Request
#################################################################

class Request(BaseModel):
    model_config = ConfigDict(extra="forbid")
    request_id: UUID
    figure: Figure
    axes: List[Axes]
    plot: List[Plot]
    data: List[Data]

if __name__ == '__main__':
    import json
    with open('docs/request-example.json') as f:
        example_json = json.load(f)
    example_request = Request.model_validate(example_json)
    
    print("Given JSON =", example_request)
    print()
    print("JSON Schema =", json.dumps(Request.model_json_schema()))