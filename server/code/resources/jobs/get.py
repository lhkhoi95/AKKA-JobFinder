from flask_restful import Resource
from models.job_model import JobModel, SavedJobModel
from flask_jwt_extended import jwt_required, get_jwt_identity
from helpers import dict_to_camel_case
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields


def unpack_jobs(jobs):
    results_list = {}
    results = {'jobs': []}
    # Unpack the job_company_application tuple

    def unpack(job_tuple):
        # unpack the job_tuple
        if (len(job_tuple) == 3):
            job, company, application = job_tuple
        else:
            job, company = job_tuple

        # convert job to camel case
        job = dict_to_camel_case(job.to_dict())
        # add company to job
        job.update({'company': dict_to_camel_case(company.to_dict())})
        # add applications list to job with key applications

        # Application is conditional because it is not always returned
        if len(results) != 0 and (len(job_tuple) == 3):

            # check if job id is in results
            job_id_in_results = int(job['id']) in [int(j['id'])
                                                   for j in results.get('jobs')]
            # if job id is in results, append the application to the current application list of that job.
            if job_id_in_results:
                # Add application to the current application list
                for j in results.get('jobs'):
                    if int(j['id']) == int(job.get('id')):
                        j['applications'].append(
                            dict_to_camel_case(application.to_dict()))
                        break
                return results
            application = dict_to_camel_case(application.to_dict())

            job.update({'applications': [application]})

        # add job to results list
        results['jobs'].append(job)
        return results

    for job in jobs:
        results_list.update(unpack((job)))

    return results_list


class GetAll(Resource):

    @ classmethod
    def get(cls):
        jobs_company = JobModel.find_all_job_company()

        # Create an empty dict to store the child dicts.
        results_list = unpack_jobs(jobs_company)

        return results_list, 200


class GetTenSchema(Schema):
    offset = fields.Int(required=True)


class GetTen(Resource):

    @ classmethod
    def get(cls):
        # Validate offset
        errors = GetTenSchema().validate(request.args)
        if errors:
            abort(400, message=errors)

        offset = request.args.get('offset')

        jobs_company = JobModel.find_ten_job_company(offset=offset)

        # Create an empty dict to store the child dicts.
        results_list = unpack_jobs(jobs_company)

        return results_list, 200


class GetOneSchema(Schema):
    job_id = fields.Int(required=True)


class GetOne(Resource):

    @ classmethod
    @ jwt_required(optional=True)
    def get(cls):

        # Validate job_id
        errors = GetOneSchema().validate(request.args)
        if errors:
            abort(400, message=errors)

        job_id = request.args.get('job_id')

        # Case 1: User is logged in as a recruiter
        if get_jwt_identity() is not None:
            user_id = get_jwt_identity().get('user_id')
            if get_jwt_identity().get('role') == 'recruiter':
                job_company_application = JobModel.find_one_job_company_application(
                    job_id)
                # Check if user is the owner of the job.
                if JobModel.is_owner(user_id, job_id):
                    result = unpack_jobs(job_company_application)
                    return result, 200
                else:
                    abort(401, message="Unauthorized")

        # Case 2: User is logged in as a candidate or not logged in at all
        job_company = JobModel.find_one_job_company_by_job_id(job_id)
        if job_company:
            result = unpack_jobs([job_company])

            return result, 200
        else:
            abort(404, message="Job not found")


class GetAllByUID(Resource):

    @ classmethod
    @ jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            return {'message': 'Unauthorized'}, 401

        user_id = get_jwt_identity().get('user_id')

        # Get all jobs and company info that belong to the current recruiter.
        jobs = JobModel.find_all_job_company_by_uid(user_id)

        # Create an empty dict to store the child dicts.
        results_list = unpack_jobs(jobs)

        return results_list, 200


class GetSavedJobs(Resource):
    @classmethod
    @jwt_required()
    def get(cls):
        if get_jwt_identity().get('role') != 'candidate':
            abort(401, message="Unauthorized")

        user_id = get_jwt_identity().get('user_id')

        # Get saved job ids
        saved_job_ids = SavedJobModel.find_all_by_uid(user_id)

        return {'savedJobs': [dict_to_camel_case(saved_job.to_dict()) for saved_job in saved_job_ids]}, 200
