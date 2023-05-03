from flask_restful import Resource
from models.skill_model import SkillModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


class DelimitedListField(fields.List):
    def _deserialize(self, value, attr, data, **kwargs):
        try:
            ids = value.split(",")
            # Remove duplicates
            ids = set(map(int, ids))
            return list(ids)

        except AttributeError:
            abort(400, message="Invalid input type.")
        except ValueError:
            abort(400, message="IDs must be integers.")


class DeleteSkillSchema(Schema):
    ids = DelimitedListField(fields.Int(), required=True)


class DeleteSkill(Resource):

    @classmethod
    @jwt_required()
    def delete(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        errors = DeleteSkillSchema().validate(request.args)
        if errors:
            abort(400, message=errors)

        data = DeleteSkillSchema().load(request.args)

        ids_to_delete = data.get('ids')

        # Get a list of skill_id of the user
        user_skills = SkillModel.find_all_by_user_id(
            get_jwt_identity().get('user_id'))
        ids_list = [skill.id for skill in user_skills]

        # Check if ids_list contains all the ids_to_delete
        result = all(elem in ids_list for elem in ids_to_delete)

        if not result:
            abort(400, message="One or more skill ids are invalid.")

        # Delete the skills from the database
        for skill_id in ids_to_delete:
            try:
                SkillModel.delete_from_db(skill_id)
            except SQLAlchemyError as e:
                print(e)
                abort(500, message='An error occurred while deleting the skill')

        return {'message': 'Skills deleted successfully'}, 200
