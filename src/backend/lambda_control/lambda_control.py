import functools
import logging

_aws_cloudwatch_logger = logging.getLogger()
_aws_cloudwatch_logger.setLevel(logging.INFO)


def lambda_log(log_when_success: bool):
    """
    Decorator function.

    When given function is executed, it wraps the function into try-catch block and executes it.
    You can decorate any function as you want.

    * If error raised, it logs the details and path of the error into AWS CloudWatch.
    * If no error, it silently returns the result.

    Args:
        log_when_success (bool): if ``True``, successful execution would also be logged.

    Returns:
        Any: If no error, returns original function's returned value. If error, returns ``None``.
    """

    def try_function_and_log(given_function):
        # This function is decorator
        @functools.wraps(given_function)
        def wrapper(*args, **kwargs):
            try:
                # Executes given function
                result = given_function(*args, **kwargs)

                # when log_when_success, record successful action
                if log_when_success:
                    _aws_cloudwatch_logger.info(
                        f"Succeed Execution: {given_function.__name__}"
                    )
            except Exception as e:
                # Error occurs, log it
                _aws_cloudwatch_logger.exception("Unhandled Exception Occured")
                return None
            else:
                return result

        return wrapper

    # Return decorator function
    return try_function_and_log


def lambda_response(given_function):
    """
    Decorator function.

    When given function is executed, its result will be directed into user response via Websocket.
    Note that multiple @lambda_response is allowed, since this is websocket program.
    """

    @functools.wraps(given_function)
    def wrapper(*args, **kwargs):
        result = given_function(*args, **kwargs)
        print("TODO: lambda_response")

    return wrapper