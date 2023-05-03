from flask_restful import Resource
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from models.job_model import JobModel
from resources.jobs.get import unpack_jobs
from flask import request


class Protected(Resource):
    @classmethod
    def get(cls):
        title = request.args.get('title')
        location = request.args.get('location')

        print(title, location)
        jobs = JobModel.get_joined_table(
            job_title=title, location=location)
        if jobs:
            jobs = unpack_jobs(jobs)
            for job in jobs['jobs']:
                pass
            return jobs, 200
        return {'jobs': []}, 200
