from flask_restful import Resource
from models.education_model import EducationModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from helpers import dict_to_camel_case


class GetAllEducationsByUID(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        # Get all educations from the database
        try:
            educations = EducationModel.find_all_by_user_id(
                get_jwt_identity().get('user_id'))
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while retrieving the educations.')

        return {'educations': [dict_to_camel_case(education.to_dict()) for education in educations]}, 200
