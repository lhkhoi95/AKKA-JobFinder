from flask_restful import Resource
from models.work_experience_model import WorkExperienceModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from helpers import convert_string_to_date
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


class AddWorkExperienceSchema(Schema):
    company_name = fields.Str(required=True)
    position = fields.Str(required=True)
    location = fields.Str(required=True, allow_none=True)
    current_job = fields.Bool(required=True, allow_none=True)
    start_date = fields.Date(required=True, allow_none=True)
    end_date = fields.Date(required=True, allow_none=True)
    description = fields.Str(required=True, allow_none=True)


class AddWorkExperience(Resource):

    @classmethod
    @jwt_required()
    def post(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        data = request.get_json()
        # Check for invalid data
        errors = AddWorkExperienceSchema().validate(data)
        if errors:
            abort(400, message=errors)

        if data['start_date']:
            data['start_date'] = convert_string_to_date(data['start_date'])

        if data['end_date']:
            data['end_date'] = convert_string_to_date(data['end_date'])

            # Check if the end date is in the past
            if data['end_date'] < data['start_date']:
                abort(400, message='Start date cannot be greater than end date')

        # Create a new work experience model
        work_experiences = WorkExperienceModel(
            **data, user_id=get_jwt_identity().get('user_id'))

        # Save the work experience model to the database
        try:
            work_experiences.save_to_db()
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while adding the job')

        return {'message': 'Work experience added successfully'}, 201


class AddBatchWorkExperiences(Resource):
    @classmethod
    @jwt_required()
    def post(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        work_experiences = request.get_json()

        # Check for invalid data
        for experience in work_experiences:
            errors = AddWorkExperienceSchema().validate(experience)
            if errors:
                errors.update({'company_name': experience['company_name']})
                abort(400, message=errors)
            if experience['start_date']:
                experience['start_date'] = convert_string_to_date(
                    experience['start_date'])

            if experience['end_date']:
                experience['end_date'] = convert_string_to_date(
                    experience['end_date'])

                if experience['end_date'] < experience['start_date']:
                    abort(400, message='Start date cannot be greater than end date')

        # Create a new work experience model
        work_experiences = [WorkExperienceModel(
            **work_experience, user_id=get_jwt_identity().get('user_id')) for work_experience in work_experiences]

        # Save the work experience model to the database
        try:
            for work_experience in work_experiences:
                work_experience.save_to_db()
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while adding the job')

        return {'message': 'Work experiences added successfully'}, 201
