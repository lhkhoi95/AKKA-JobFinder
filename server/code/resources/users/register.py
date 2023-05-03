from flask_restful import Resource
from models.user_model import UserModel
from models.candidate_model import CandidateModel
from models.recruiter_model import RecruiterModel
from security import hash_password
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields, validate


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
    role = fields.Str(required=True, validate=validate.OneOf(
        ['candidate', 'recruiter']))


class Register(Resource):

    @classmethod
    def post(cls):
        errors = RegisterSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        data = request.get_json()

        # Check if email already exists in users table.
        if UserModel.find_by_email(data['email']):
            abort(400, message='Email already exists')

        # Hash password before saving into database
        data['password'] = hash_password(data['password'])

        # Instantiate an UserModel object to save to database
        user = UserModel(**data)
        user.save_to_db()
        # Create a candidate or recruiter object
        if data['role'] == 'candidate':
            candidate = CandidateModel(user_id=user.id)
            candidate.save_to_db()
        else:
            recruiter = RecruiterModel(user_id=user.id)
            recruiter.save_to_db()
        return {'message': 'User created successfully'}, 201
