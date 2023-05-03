from distutils import errors
from flask_restful import Resource
from models.skill_model import SkillModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


class UpdateSkillSchema(Schema):
    skills = fields.List(fields.Str(), required=True)


class UpdateSkill(Resource):

    @classmethod
    @jwt_required()
    def put(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        errors = UpdateSkillSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        data = request.get_json()

        # Convert list of skills to set to remove duplicates
        skills_to_add = set(data.get('skills'))

        # Delete all skills of the user
        try:
            SkillModel.delete_all_by_uid(get_jwt_identity().get('user_id'))
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while deleting the skills')

        # Add the new skills to the database
        for skill in skills_to_add:
            new_skill = SkillModel(
                name=skill, user_id=get_jwt_identity().get('user_id'))
            try:
                new_skill.save_to_db()
            except SQLAlchemyError as e:
                print(e)
                abort(500, message='An error occurred while adding the skill')

        return {'message': 'Skills updated successfully'}, 201
