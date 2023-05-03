from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_smorest import abort
from models.education_model import EducationModel
from sqlalchemy.exc import SQLAlchemyError
from flask import request


class DeleteEducation(Resource):
    @classmethod
    @jwt_required()
    def delete(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        try:
            ids = request.args.get('ids').split(',')
            # check if all elements are greater than 0 and cast to int
            valid_ids = [int(id) for id in ids]
        except:
            abort(400, message='IDs must be integers and separated by commas.')

        # Get if all ids exist in database
        if not EducationModel.exists(valid_ids):
            abort(400, message='One or more IDs are not found. No changes were made.')

        # Delete the educations from the database
        for education_id in valid_ids:
            try:
                EducationModel.delete_by_id(education_id)
            except SQLAlchemyError as e:
                print(e)
                abort(500, message='An error occurred while deleting the education.')

        return {'message': 'Educations deleted successfully.'}, 200
