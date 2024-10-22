from typing import List, Tuple
from pydantic import BaseModel, ValidationError


class CauseError:
    source: str  # location of error
    message: str  # explaination of error


def get_readable_location(loc: Tuple[int | str]):
    """Convert `ErrorDetails.loc` into human-friendly format. Subfunction of `get_pretty_validation_error`."""

    result = "request"
    for key in loc:
        if isinstance(key, str):
            # string key
            result += f".{key}"
        elif isinstance(key, int):
            # index
            result += f"[{key}]"
        else:
            raise TypeError(f"Unexpected type for : {type(key)}")

    return result


def get_pretty_validation_error(e: ValidationError) -> List[CauseError]:
    """Prettify the given `ValidationError` to more human-friendly format."""
    error_list = e.errors()
    error_model_list = []

    for error_details in error_list:
        error_model = CauseError(
            source=get_readable_location(error_details["loc"]),
            message=error_details["msg"],
        )
        error_model_list.append(error_model)

    return error_model_list