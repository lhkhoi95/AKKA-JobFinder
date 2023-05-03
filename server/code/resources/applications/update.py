from flask_restful import Resource
from models.application_model import ApplicationModel
from models.job_model import JobModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields, validate
from helpers import dict_to_camel_case


class UpdateApplicationSchema(Schema):
    id = fields.Int(
        required=True)
    status = fields.Str(
        required=True, validate=validate.OneOf(['Accepted', 'Rejected', 'Pending']))


class UpdateApplication(Resource):
    @classmethod
    @jwt_required()
    def put(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            abort(403, message='You are not authorized to access this resource.')
        data = request.get_json()
        # Check for invalid data
        errors = UpdateApplicationSchema().validate(data)
        if errors:
            abort(400, message=errors)
        user_id = get_jwt_identity().get('user_id')
        try:
            # Find the application by job id
            application = ApplicationModel.find_by_application_id(data['id'])
            if not application:
                abort(404, message='Application not found')

            # Check if the recruiter is the owner of the job
            is_owner = JobModel.is_owner(user_id, application.job_id)
            if not is_owner:
                abort(403, message='You are not the owner of this application')

            # update the status
            application.status = data['status']
            # Save the application model to the database
            application.save_to_db()
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while updating the application')
        return {'application': dict_to_camel_case(application.to_dict())}, 201
