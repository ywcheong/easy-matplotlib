import pytest
from pydantic import ValidationError

from src.backend.request_format import RequestElement
from .test_helper import TestHelper

@pytest.mark.parametrize("filename", TestHelper.success())
def test_success_model(filename):
    json_content = TestHelper.load_testcase(filename)
    request_content = RequestElement.model_validate(json_content)


@pytest.mark.parametrize("filename", TestHelper.fail())
def test_fail_model(filename):
    json_content = TestHelper.load_testcase(filename)
    with pytest.raises(ValidationError):
        request_content = RequestElement.model_validate(json_content)


@pytest.mark.parametrize("filename", TestHelper.invalid())
def test_invalid_model(filename):
    json_content = TestHelper.load_testcase(filename)
    with pytest.raises(ValidationError):
        request_content = RequestElement.model_validate(json_content)
