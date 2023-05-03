from flask_restful import Resource
from models.work_experience_model import WorkExperienceModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from helpers import dict_to_camel_case


class GetAllWorkExperiencesByUID(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        try:
            work_experiences = WorkExperienceModel.find_all_by_user_id(
                get_jwt_identity().get('user_id'))
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while retrieving the work experiences.')

        return {'work_experiences': [dict_to_camel_case(work.to_dict()) for work in work_experiences]}, 200
