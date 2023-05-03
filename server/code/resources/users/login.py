from security import hash_password
from flask_restful import Resource, reqparse
from models.user_model import UserModel
from flask_jwt_extended import create_access_token, set_access_cookies
from helpers import response_message_code
from flask import Response, request
from flask_smorest import abort
from marshmallow import Schema, fields
import json

# Schema to validate the json body of the request.


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class Login(Resource):

    """
    Return a dictionary that contains user login information such as email, password, etc.
    Perform basic validation on email and password.
    Create access token that will be stored in web browser cookies.
    The front end (website) does not need to handle any logic.
    """
    @classmethod
    def post(cls):

        errors = LoginSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        data = request.get_json()

        # Check if email exists in candidates table
        user = UserModel.find_by_email(data['email'])

        if not user:
            response = response_message_code('Invalid Email', 403)
            return response
        elif user.password != hash_password(data['password']):
            response = response_message_code('Wrong password', 403)
            return response

        response = Response(
            response=json.dumps({
                "user_info": {
                    "uid": user.id,
                    "email": user.email,
                    "role": user.role
                }
            }),
            status=200,
            mimetype="application/json"
        )

        access_token = create_access_token(
            identity={'user_id': user.id, 'role': user.role})

        set_access_cookies(response, access_token)

        return response
