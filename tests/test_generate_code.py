import pytest

from src.backend.request_format import RequestElement
from src.backend.generate_code import GenerateCode
from tests.test_helper import TestHelper

def test_generate_code():
    test_file = 'requestformat-success-1.json'
    json_object = TestHelper.load_testcase(test_file)
    request_model = RequestElement.model_validate(json_object)
    test_code_factory = GenerateCode(request_model)
    result_code = test_code_factory.generate()
    print(result_code)
