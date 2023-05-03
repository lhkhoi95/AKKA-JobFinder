from flask_restful import Resource
from models.job_model import JobModel
from models.skill_model import SkillModel
from models.candidate_model import CandidateModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from helpers import dict_to_camel_case
from flask_smorest import abort
from flask import request
from sqlalchemy.exc import SQLAlchemyError
from resources.jobs.get import unpack_jobs

# for everyone


class SearchByLocationAndTitle(Resource):
    @ classmethod
    def get(cls):
        title = request.args.get('title', None)
        location = request.args.get('location', None)

        try:
            jobs = JobModel.find_all_job_company_by_title_location(
                job_title=title, location=location)
            if jobs:
                jobs = unpack_jobs(jobs)
                return jobs, 200
            return {'jobs': []}, 200
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='Internal Server Error')


# for recruiter
class SearchBySkills(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity()['role'] != 'recruiter':
            abort(403, message='Unauthorized')

        skills = request.args.get('skills', None)
        skills = skills.split(',')

        candidate_ids = SkillModel.find_all_by_skill_names(skills)
        print(candidate_ids)
        candidates = {'candidates': []}
        for id in candidate_ids:
            # find candidate by user_id
            candidates['candidates'].append(
                CandidateModel.find_candidate_profile(id))

        return candidates, 200
