from flask_restful import Resource, reqparse
from models.recruiter_model import RecruiterModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from helpers import dict_to_camel_case
from flask_smorest import abort
from sqlalchemy.exc import SQLAlchemyError
from flask import request
from helpers import dict_to_camel_case
from flask_smorest import abort
from marshmallow import Schema, fields

# Schema to validate the json body of the request.


class UpdateRecruiterSchema(Schema):
    company_name = fields.Str(required=True)
    company_size = fields.Int(required=True)
    industry = fields.Str(required=True)
    company_logo_url = fields.URL(required=True)


class UpdateRecruiterProfile(Resource):

    @classmethod
    @jwt_required()
    def put(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            abort(401, message='You are not authorized to access this route')

        errors = UpdateRecruiterSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        data = request.get_json()
        recruiter = RecruiterModel.find_by_user_id(
            get_jwt_identity().get('user_id'))

        # Check if recruiter exists
        if recruiter is None:
            abort(404, message='Recruiter not found')
        try:
            # Update recruiter's profile
            recruiter.update(recruiter.id, **data)
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while updating the recruiter.')

        return dict_to_camel_case(recruiter.to_dict()), 201
