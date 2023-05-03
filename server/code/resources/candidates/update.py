from flask_restful import Resource
from models.candidate_model import CandidateModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask import request
from sqlalchemy.exc import SQLAlchemyError
from helpers import dict_to_camel_case
from flask_smorest import abort
from marshmallow import Schema, fields

# Schema to validate the json body of the request


class UpdateCandidateSchema(Schema):
    full_name = fields.Str(required=True)
    location = fields.Str(required=True)
    bio = fields.Str(required=True)
    resume_url = fields.Str(required=True)
    phone_number = fields.Str(required=True)


class UpdateCandidateProfile(Resource):

    @classmethod
    @jwt_required()
    def put(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(401, message='You are not authorized to access this route')

        # Validate json data from the request body
        errors = UpdateCandidateSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        # Get the data from the request body.
        data = request.get_json()
        candidate = CandidateModel.find_by_user_id(
            get_jwt_identity().get('user_id'))

        # Check if candidate exists
        if candidate is None:
            abort(404, message='Candidate not found')
        try:
            # Update candidate's profile
            candidate.update(candidate.id, **data)
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while updating the candidate.')

        return dict_to_camel_case(candidate.to_dict()), 201
