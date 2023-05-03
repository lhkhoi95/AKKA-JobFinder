from flask_restful import Resource
from flask_jwt_extended import unset_jwt_cookies
from helpers import response_message_code


class Logout(Resource):

    @classmethod
    def post(cls):
        response = response_message_code('Logout successful', 200)
        unset_jwt_cookies(response)
        return response
