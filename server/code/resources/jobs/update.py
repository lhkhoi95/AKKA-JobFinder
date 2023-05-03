from flask_restful import Resource
from models.job_model import JobModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from helpers import dict_to_camel_case, convert_string_to_date
from flask_smorest import abort
from marshmallow import Schema, fields
from flask import request
from sqlalchemy.exc import SQLAlchemyError

# Schema to validate the json body of the request


class UpdateJobSchema(Schema):
    job_id = fields.Int(required=True)
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


class UpdateJob(Resource):

    @classmethod
    @jwt_required()
    def put(cls):
        # Validate form data
        errors = UpdateJobSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        # data = UpdateJob.parser.parse_args()
        data = request.get_json()

        # Check if salary_min is less than salary_max
        if data['salary_min'] is not None and data['salary_max'] is not None:
            if data['salary_min'] > data['salary_max']:
                abort(400, message='salary_min cannot be greater than salary_max')

        # Check if start_date is less than end_date
        if data['start_date'] > data['end_date']:
            abort(400, message='start_date cannot be greater than end_date')

        # Find job by job_id
        job = JobModel.find_by_job_id(data['job_id'])

        user_id = get_jwt_identity().get('user_id')
        if job is None or job.user_id != user_id:
            abort(403, message='You are not authorized to update this job')

        try:
            # Convert string to date
            data['start_date'] = convert_string_to_date(data['start_date'])
            data['end_date'] = convert_string_to_date(data['end_date'])
            job_to_update = JobModel.update(**data)
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while updating job')

        return {'updatedJob': dict_to_camel_case(job_to_update.to_dict())}, 200
