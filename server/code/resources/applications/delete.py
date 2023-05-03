from flask_restful import Resource
from models.application_model import ApplicationModel
from models.job_model import JobModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


class DeleteSchema(Schema):
    application_id = fields.Int(required=True, validate=lambda x: x > 0)


class DeleteApplication(Resource):

    @classmethod
    @jwt_required()
    def delete(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(401, message='You are not authorized to access this route')

        errors = DeleteSchema().validate(request.args)
        if errors:
            abort(400, message=errors)

        # get the application_id from the url
        application_id = request.args.get('application_id')
        user_id = get_jwt_identity().get('user_id')

        try:
            application = ApplicationModel.find_by_application_id(
                application_id)
            if not application:
                abort(404, message='Application not found')

            # Check if the user is the owner of the application
            is_owner = ApplicationModel.is_owner(user_id, application_id)
            if not is_owner:
                abort(403, message='You are not the owner of this application')

            # Delete the application
            application.delete_by_id(application_id)

            return {'message': 'Application deleted successfully'}, 200
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while deleting the application.')
