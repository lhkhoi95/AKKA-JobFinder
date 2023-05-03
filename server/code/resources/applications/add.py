from flask_restful import Resource
from models.application_model import ApplicationModel
from models.job_model import JobModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


class AddApplicationSchema(Schema):
    job_id = fields.Int(required=True)


class AddApplication(Resource):
    @classmethod
    @jwt_required()
    def post(cls):

        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        data = request.get_json()
        # Check for invalid data
        errors = AddApplicationSchema().validate(data)
        if errors:
            abort(400, message=errors)
        user_id = get_jwt_identity().get('user_id')
        # Add candidate id to the data
        data['user_id'] = user_id

        # Check if job id is available
        job = JobModel.find_by_job_id(data['job_id'])
        if not job:
            abort(404, message='Job not found')

        # Check if user already applied for the job
        user_applied = ApplicationModel.user_applied(user_id, data['job_id'])
        if user_applied:
            return {'message': 'You have already applied for this job'}, 200

        # Create a new application model
        data['status'] = 'Processing'
        application = ApplicationModel(**data)

        # Save the application model to the database
        try:
            application.save_to_db()
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while adding the application')

        return {'message': 'Application added successfully'}, 201
