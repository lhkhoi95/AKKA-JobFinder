from flask_restful import Resource
from models.membership_model import MembershipModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from helpers import convert_string_to_date
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields, validate
from datetime import date


class AddMembershipSchema(Schema):
    # Type can be 'Monthly', 'Semi-Annual', or 'Annual'
    type = fields.Str(required=True, validate=validate.OneOf(
        ['Monthly', 'Semi-Annual', 'Annual']))
    price = fields.Float(required=True)


class AddMembership(Resource):

    @classmethod
    @jwt_required()
    def post(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            abort(403, message='You are not authorized to access this resource.')

        errors = AddMembershipSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        data = request.get_json()

        user_id = get_jwt_identity().get('user_id')

        # Check if membership already exists
        if MembershipModel.find_by_uid(user_id):
            abort(400, message='You have already subscribed to a membership.')

        new_membership = MembershipModel(**data, user_id=user_id)

        try:
            new_membership.save_to_db()
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while adding the job')

        return {'message': 'Membership added successfully.'}, 201
