import os, pathlib, json
from typing import List, Any

class TestHelper:
    """
    Helper function for test. Loads JSON for each testcase.
    """

    TEST_FILE_PATH = pathlib.Path(__file__)
    TEST_DIRECTORY = (TEST_FILE_PATH / "..").resolve()
    TEST_DATA_DIRECTORY = (TEST_DIRECTORY / "data").resolve()
    
    SUCCESS_CASE_PREFIX = "requestformat-success"
    FAIL_CASE_PREFIX = "requestformat-fail"
    INVALID_CASE_PREFIX = "requestformat-invalid"

    is_initialized = False
    success_list, fail_list, invalid_list = [], [], []
    
    @classmethod
    def _read_all_testcase(cls) -> tuple[List[str], List[str], List[str]]:
        """
        Read the list of testcases from ``/test/data`` and classify into Success, Fail, Invalid.

        Each list contains filename, which can be directly passed into ``read_json``.
        """
        testcase_list = os.listdir(cls.TEST_DATA_DIRECTORY)

        for testcase in testcase_list:
            if testcase.startswith(TestHelper.SUCCESS_CASE_PREFIX):
                cls.success_list.append(testcase)
            elif testcase.startswith(TestHelper.FAIL_CASE_PREFIX):
                cls.fail_list.append(testcase)
            elif testcase.startswith(TestHelper.INVALID_CASE_PREFIX):
                cls.invalid_list.append(testcase)

        cls.is_initialized = True
    
    @classmethod
    def success(cls):
        if not cls.is_initialized:
            cls._read_all_testcase()
        return cls.success_list

    @classmethod
    def fail(cls):
        if not cls.is_initialized:
            cls._read_all_testcase()
        return cls.fail_list

    @classmethod
    def invalid(cls):
        if not cls.is_initialized:
            cls._read_all_testcase()
        return cls.invalid_list

    @classmethod
    def load_testcase(cls, filename: str) -> Any:
        """
        Read the given testcase file, and returns Object build from the file.

        The parameter can retrieved through ``get_testcases`` function.
        """
        with open(cls.TEST_DATA_DIRECTORY / filename) as fp:
            json_content = json.load(fp)
        return json_content
