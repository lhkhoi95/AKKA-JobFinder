from flask_restful import Resource
from models.job_model import JobModel, SavedJobModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from helpers import convert_string_to_date
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields
from datetime import date

# Schema to validate the json body of the request.


class AddJobSchema(Schema):
    title = fields.Str(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    location = fields.Str(required=True)
    type = fields.Str(required=True)
    category = fields.Str(required=True)
    experience_level = fields.Str(required=True)
    salary_min = fields.Int(required=True)
    salary_max = fields.Int(required=True)
    description = fields.Str(required=True)


class AddJob(Resource):

    @classmethod
    @jwt_required()
    def post(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            abort(403, message='You are not authorized to access this resource.')
        # Check for invalid data
        errors = AddJobSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        data = request.get_json()

        if data['salary_min'] > data['salary_max']:
            abort(400, message='Salary min cannot be greater than salary max')

        data['start_date'] = convert_string_to_date(data['start_date'])
        data['end_date'] = convert_string_to_date(data['end_date'])

        # Check if the end date is in the past
        if data['end_date'] < date.today():
            abort(400, message='The end date cannot be in the past.')

        if data['start_date'] > data['end_date']:
            abort(400, message='Start date cannot be greater than end date')

        # TODO: Check if user has membership

        user_id = get_jwt_identity().get('user_id')

        new_job = JobModel(**data, user_id=user_id)

        try:
            new_job.save_to_db()
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while adding the job')

        return {'message': 'Job created successfully.'}, 201


class SavedJobSchema(Schema):
    job_id = fields.Int(required=True)


class SaveJob(Resource):
    @classmethod
    @jwt_required()
    def post(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        # Check for invalid data
        errors = SavedJobSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)
        data = request.get_json()
        user_id = get_jwt_identity().get('user_id')
        job_id = data.get('job_id')

        try:
            # Check if job_id exists
            if SavedJobModel.job_was_saved(user_id=user_id, job_id=job_id):
                abort(400, message='Job already saved.')

            new_saved_job = SavedJobModel(user_id=user_id, job_id=job_id)
            SavedJobModel.save_to_db(new_saved_job)
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while saving the job')
        return {'message': 'Job saved successfully.'}, 201
