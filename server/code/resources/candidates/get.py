from flask_restful import Resource
from models.candidate_model import CandidateModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from helpers import dict_to_camel_case
from flask_smorest import abort


class GetCandidateProfile(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(401, message='You are not authorized to access this route')

        # get candidate by user_id
        candidate = CandidateModel.find_candidate_profile(
            get_jwt_identity().get('user_id'))

        if candidate is None:
            abort(404, message='Candidate not found')

        return candidate, 200
