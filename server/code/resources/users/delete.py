from flask_restful import Resource
from models.user_model import UserModel
from sqlalchemy.exc import SQLAlchemyError
from marshmallow import Schema, fields
from flask_jwt_extended import get_jwt_identity, jwt_required, unset_jwt_cookies
from flask_smorest import abort
from flask import request
from helpers import response_message_code
from security import hash_password


class DeleteUserSchema(Schema):
    password = fields.Str(required=True)


class Delete(Resource):

    @classmethod
    @jwt_required()
    def post(cls):
        user_id = get_jwt_identity().get('user_id')
        errors = DeleteUserSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        input_password = hash_password(request.get_json().get('password'))
        user = UserModel.find_by_id(user_id)
        if not user:
            abort(404, message='User not found')
        if user.password != input_password:
            abort(401, message='Incorrect password')

        try:
            UserModel.delete_by_id(user_id)
            response = response_message_code(
                'Account deleted and logged out successfully', 200)
            unset_jwt_cookies(response)
            return response
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while deleting the user')
