from flask_restful import Resource
from models.work_experience_model import WorkExperienceModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from helpers import convert_string_to_date
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields
from marshmallow.validate import Range
from helpers import dict_to_camel_case


class UpdateWorkExperienceSchema(Schema):
    id = fields.Int(required=True, validate=[Range(
        min=1, error="Value must be greater than 0")])
    company_name = fields.Str(required=True)
    position = fields.Str(required=True)
    location = fields.Str(required=True, allow_none=True)
    current_job = fields.Bool(required=True, allow_none=True)
    start_date = fields.Date(required=True, allow_none=True)
    end_date = fields.Date(required=True, allow_none=True)
    description = fields.Str(required=True, allow_none=True)


class UpdateWorkExperience(Resource):
    @classmethod
    @jwt_required()
    def put(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')
        ids_to_update = []
        data_list = request.get_json()
        for data in data_list:
            # Check for invalid data
            errors = UpdateWorkExperienceSchema().validate(data)
            if errors:
                abort(400, message=errors)

            if data['start_date']:
                data['start_date'] = convert_string_to_date(data['start_date'])

            if data['end_date']:
                data['end_date'] = convert_string_to_date(data['end_date'])

                # Check if the end date is in the past
                if data['end_date'] < data['start_date']:
                    abort(400, message='Start date cannot be greater than end date')

            # Save the work experience model to the database
            try:
                new_work_experience = WorkExperienceModel.update(**data)
                if not new_work_experience:
                    abort(400, message='Work experience id not found')

                ids_to_update.append(new_work_experience.id)

            except SQLAlchemyError as e:
                print(e)
                abort(
                    500, message='An error occurred while updating the work experience')
        try:
            work_experiences = []
            for id in ids_to_update:
                work_experiences.append(
                    WorkExperienceModel.find_by_work_id(id))
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while retrieving the work experiences.')

        return {'work_experiences': [dict_to_camel_case(work.to_dict()) for work in work_experiences]}, 200
