from flask_restful import Resource
from models.membership_model import MembershipModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from helpers import dict_to_camel_case
from sqlalchemy.exc import SQLAlchemyError
from helpers import convert_string_to_date
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


class GetMembership(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            abort(403, message='You are not authorized to access this resource.')

        # Get membership information
        membership = MembershipModel.find_by_uid(
            get_jwt_identity().get('user_id'))

        # Return membership information
        if membership:
            return dict_to_camel_case(membership.to_dict()), 200
        else:
            abort(404, message='You have not subscribed to any membership yet.')
