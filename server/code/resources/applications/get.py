from flask_restful import Resource
from models.application_model import ApplicationModel
from models.job_model import JobModel
from models.recruiter_model import RecruiterModel
from models.candidate_model import CandidateModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from helpers import dict_to_camel_case
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort
from flask import request


class GetAllApplicationsByUID(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(403, message='You are not authorized to access this resource.')

        # Get all applications by user id
        try:
            applications = ApplicationModel.find_by_user_id(
                get_jwt_identity().get('user_id'))
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while getting the applications')

        # Check if there are no applications
        if not applications:
            return {'applications': []}, 200
        results = []
        # Get job info for each application
        for application in applications:
            application = dict_to_camel_case(application.to_dict())
            job_info = JobModel.find_by_job_id(application['jobId'])
            application['jobInfo'] = dict_to_camel_case(job_info.to_dict())

            recruiter_info = RecruiterModel.find_by_user_id(
                application['jobInfo']['userId'])
            application['companyInfo'] = dict_to_camel_case(
                recruiter_info.to_dict())
            results.append(application)

        # Return all applications
        return {'applications': results}, 200


class GetAllApplicationsByJobID(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            abort(403, message='You are not authorized to access this resource.')

        if request.args.get('job_id') is None:
            abort(400, message='job_id is required')
        try:
            job_id = int(request.args.get('job_id'))
            if job_id <= 0:
                abort(400, message='job_id must be a positive integer')
        except ValueError:
            abort(400, message='job_id must be an integer')

        # check if job_id belongs to recruiter
        if not JobModel.is_owner(get_jwt_identity().get('user_id'), job_id):
            abort(403, message='You are not authorized to access this resource.')

        # Get all applications by job_id
        applications = ApplicationModel.find_by_job_id(job_id)
        # Check if there are no applications
        if not applications:
            return [], 200
            

        results = []
        for application in applications:
            app_to_dict = dict_to_camel_case(application.to_dict())
            candidate = CandidateModel.find_candidate_profile(
                app_to_dict['userId'])

            results.append({'candidateInfo': candidate,
                           'applicationInfo': app_to_dict})

        return results, 200
