from typing import List, Tuple
from pydantic import BaseModel, ValidationError


class ErrorModel(BaseModel):
    loc: str  # location of error
    msg: str  # explaination of error


def pretty_loc(loc: Tuple[int | str]):
    result = "request"

    for key in loc:
        if type(key) == str:
            # string key
            result += f".{key}"
        else:
            # index
            result += f"[{key}]"

    return result


def pretty_validation_error(e: ValidationError) -> List[ErrorModel]:
    error_list = e.errors()
    error_model_list = []

    for error in error_list:
        error_model = ErrorModel(loc=pretty_loc(error["loc"]), msg=error["msg"])
        error_model_list.append(error_model)

    return error_model_list
