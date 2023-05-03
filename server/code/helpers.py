import datetime
from flask_mail import Mail
from flask import Response, make_response, Response
import json


mail = Mail()

# a function that returns a response with a message and a status code.


def response_message_code(dict, status_code=None):

    return Response(
        response=json.dumps({
            "message": dict,
        }),
        status=status_code,
        mimetype="application/json"
    )

# convert snake case to camel case


def string_to_camel_case(snake_str):
    components = snake_str.split('_')
    # We capitalize the first letter of each component except the first one
    # with the 'title' method and join them together.
    return components[0] + ''.join(x.title() for x in components[1:])

# convert dictionary to camel case


def dict_to_camel_case(dict):
    outputs = {}
    for key, value in dict.items():
        key = string_to_camel_case(key)
        if value == 'None':
            value = None
        outputs[key] = value

    return outputs

# convert a string of date to a datetime object


def convert_string_to_date(string):
    format = '%Y-%m-%d'
    return datetime.datetime.strptime(string, format).date()

# return a response with customized message and a status code


def response_custom_message(message, data, status_code=None):
    return make_response({message: str(data)}, status_code)
