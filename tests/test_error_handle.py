from typing import List
from pydantic import BaseModel, ValidationError, model_validator
from src.backend.request_format import CauseError, get_pretty_validation_error


class Point(BaseModel):
    x: float
    y: float


class Circle(BaseModel):
    name: str
    center: Point
    elses: List[Point]


my_circle = {
    "name": "MyName",
    "center": {"x": "what", "y": 12},
    "elses": [{"x": 2, "y": 3}, "bruh", {"p": 5, "q": "r"}],
}

expected_pretty = [
    CauseError(
        source="request.center.x",
        message="Input should be a valid number, unable to parse string as a number",
    ),
    CauseError(
        source="request.elses[1]",
        message="Input should be a valid dictionary or instance of Point",
    ),
    CauseError(source="request.elses[2].x", message="Field required"),
    CauseError(source="request.elses[2].y", message="Field required"),
]


def test_pretty():
    try:
        Circle.model_validate(my_circle)
    except ValidationError as e:
        assert get_pretty_validation_error(e) == expected_pretty
