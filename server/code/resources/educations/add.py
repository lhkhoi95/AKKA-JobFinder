from flask_restful import Resource
from models.education_model import EducationModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from helpers import convert_string_to_date
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


class AddEducationSchema(Schema):
    school_name = fields.Str(required=True)
    degree = fields.Str(required=True, allow_none=True)
    major = fields.Str(required=True, allow_none=True)
    start_date = fields.Date(required=True, allow_none=True)
    end_date = fields.Date(required=True, allow_none=True)
    description = fields.Str(required=True, allow_none=True)


class AddEducation(Resource):

    @classmethod
    @jwt_required()
    def post(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        data = request.get_json()
        # Check for invalid data
        errors = AddEducationSchema().validate(data)
        if errors:
            abort(400, message=errors)
        if data['start_date']:
            data['start_date'] = convert_string_to_date(data['start_date'])

        if data['end_date']:
            data['end_date'] = convert_string_to_date(data['end_date'])

            # Check if the end date is in the past
            if data['end_date'] < data['start_date']:
                abort(400, message='Start date cannot be greater than end date')

        # Create a new education model
        education = EducationModel(
            **data, user_id=get_jwt_identity().get('user_id'))

        # Save the education model to the database
        try:
            education.save_to_db()
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while adding the job')

        return {'message': 'Education added successfully'}, 201


class AddBatchEducations(Resource):
    @classmethod
    @jwt_required()
    def post(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        educations = request.get_json()

        # Check for invalid data
        for education in educations:
            errors = AddEducationSchema().validate(education)
            if errors:
                errors.update({'education': education['school_name']})
                abort(400, message=errors)
            if education['start_date']:
                education['start_date'] = convert_string_to_date(
                    education['start_date'])

            if education['end_date']:
                education['end_date'] = convert_string_to_date(
                    education['end_date'])

                if education['end_date'] < education['start_date']:
                    abort(400, message='Start date cannot be greater than end date')

        # Create a new education model
        educations = [EducationModel(
            **education, user_id=get_jwt_identity().get('user_id')) for education in educations]

        # Save the education model to the database
        try:
            for education in educations:
                education.save_to_db()
        except SQLAlchemyError as e:
            abort(500, message='An error occurred while adding the job')

        return {'message': 'All educations added successfully'}, 201
