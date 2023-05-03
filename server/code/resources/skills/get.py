from flask_restful import Resource
from models.skill_model import SkillModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_smorest import abort
from helpers import dict_to_camel_case


class GetAllSkillsByUID(Resource):

    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        user_id = get_jwt_identity().get('user_id')

        # get a SET of skills of the user
        user_skills = SkillModel.find_all_by_user_id(user_id)

        return {'skills': [dict_to_camel_case(skill.to_dict()) for skill in user_skills]}, 200
