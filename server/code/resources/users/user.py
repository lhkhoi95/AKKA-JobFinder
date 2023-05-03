from flask_restful import Resource
from models.user_model import UserModel
from models.recruiter_model import RecruiterModel
from models.candidate_model import CandidateModel


class User(Resource):

    @classmethod
    def get(cls):
        users = UserModel.find_all()
        return {'users': [user.to_dict() for user in users]}, 200
