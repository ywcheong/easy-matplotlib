import os, pathlib
import json
import pytest

from src.backend.request_format import RequestElement, CodeReject

TEST_FILE_PATH = pathlib.Path(__file__)
TEST_DIRECTORY = (TEST_FILE_PATH / "..").resolve()
TEST_DATA_DIRECTORY = (TEST_DIRECTORY / "data").resolve()

SUCCESS_CASE_PREFIX = "requestformat-success"
FAIL_CASE_PREFIX = "requestformat-fail"

testcase_list = os.listdir(TEST_DATA_DIRECTORY)
success_list, fail_list = [], []

for testcase in testcase_list:
    if testcase.startswith(SUCCESS_CASE_PREFIX):
        success_list.append(testcase)
    elif testcase.startswith(FAIL_CASE_PREFIX):
        fail_list.append(testcase)


def read_json(filename):
    with open(TEST_DATA_DIRECTORY / filename) as fp:
        json_content = json.load(fp)
    return json_content


@pytest.mark.parametrize("filename", success_list)
def test_success_model(filename):
    json_content = read_json(filename)
    request_content = RequestElement.model_validate(json_content)

@pytest.mark.parametrize("filename", fail_list)
def test_fail_model(filename):
    json_content = read_json(filename)
    with pytest.raises(CodeReject):
        request_content = RequestElement.model_validate(json_content)