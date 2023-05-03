from flask_restful import Resource
from models.education_model import EducationModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from helpers import convert_string_to_date
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields
from marshmallow.validate import Range
from helpers import dict_to_camel_case


class UpdateEducationSchema(Schema):
    school_id = fields.Int(required=True, validate=[Range(
        min=1, error="Value must be greater than 0")])
    school_name = fields.Str(required=True)
    degree = fields.Str(required=True, allow_none=True)
    major = fields.Str(required=True, allow_none=True)
    start_date = fields.Date(required=True, allow_none=True)
    end_date = fields.Date(required=True, allow_none=True)
    description = fields.Str(required=True, allow_none=True)


class UpdateEducation(Resource):
    @classmethod
    @jwt_required()
    def put(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        data_list = request.get_json()
        ids_to_update = []
        for data in data_list:
            # Check for invalid data
            errors = UpdateEducationSchema().validate(data)
            if errors:
                abort(400, message=errors)
            if data['start_date']:
                data['start_date'] = convert_string_to_date(data['start_date'])
            if data['end_date']:
                data['end_date'] = convert_string_to_date(data['end_date'])

                # Check if the end date is in the past
                if data['end_date'] < data['start_date']:
                    abort(400, message='Start date cannot be greater than end date')

            # Save the education model to the database
            try:
                new_education = EducationModel.update(**data)
                if not new_education:
                    abort(400, message='Education not found')
                ids_to_update.append(new_education.school_id)

            except SQLAlchemyError as e:
                print(e)
                abort(500, message='An error occurred while updating the education')

        # Get all educations from the database
        try:
            educations = []
            for id in ids_to_update:
                educations.append(
                    EducationModel.find_by_school_id(id))

        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while retrieving the educations.')

        return {'educations': [dict_to_camel_case(education.to_dict()) for education in educations]}, 200
