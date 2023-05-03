import os
from db import db
from helpers import mail
from flask import Flask
from datetime import datetime
from datetime import timedelta
from datetime import timezone
from flask_restful import Api
from flask_cors import CORS
from resources.users.user import User
from resources.users.register import Register
from resources.users.login import Login
from resources.users.recover_password import RecoverPasswordURL, ResetPassword
from resources.users.protected import Protected
from resources.users.logout import Logout
from resources.users.update import UpdateProfile
from resources.users.delete import Delete
from resources.candidates.update import UpdateCandidateProfile
from resources.candidates.get import GetCandidateProfile
from resources.recruiters.update import UpdateRecruiterProfile
from resources.recruiters.get import GetRecruiterProfile
from resources.recruiters.get import GetCandidateProfiles
from resources.jobs.add import AddJob, SaveJob
from resources.jobs.get import GetAll, GetTen, GetAllByUID, GetOne, GetSavedJobs
from resources.jobs.delete import DeleteJob, DeleteSavedJob
from resources.jobs.update import UpdateJob
from resources.memberships.add import AddMembership
from resources.memberships.get import GetMembership
from resources.memberships.update import UpdateMembership
from resources.memberships.delete import DeleteMembership
from resources.skills.add import AddSkillList
from resources.skills.add import AddOne
from resources.skills.get import GetAllSkillsByUID
from resources.skills.delete import DeleteSkill
from resources.skills.update import UpdateSkill
from resources.educations.add import AddEducation
from resources.educations.add import AddBatchEducations
from resources.educations.delete import DeleteEducation
from resources.educations.get import GetAllEducationsByUID
from resources.educations.update import UpdateEducation
from resources.work_experiences.get import GetAllWorkExperiencesByUID
from resources.work_experiences.add import AddWorkExperience
from resources.work_experiences.add import AddBatchWorkExperiences
from resources.work_experiences.update import UpdateWorkExperience
from resources.work_experiences.delete import DeleteWorkExperience
from resources.applications.get import GetAllApplicationsByUID
from resources.applications.get import GetAllApplicationsByJobID
from resources.applications.add import AddApplication
from resources.applications.update import UpdateApplication
from resources.applications.delete import DeleteApplication
from resources.search.get import SearchByLocationAndTitle
from resources.search.get import SearchBySkills
from resources.db_cleaner import *
from dotenv import load_dotenv
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, JWTManager, set_access_cookies


app = Flask(__name__)
api = Api(app)
jwt = JWTManager(app)
CORS(app, supports_credentials=True)

load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
# os.getenv('EMAIL_USER')
app.config['MAIL_USERNAME'] = 'akkajobfinderservice@gmail.com'
# os.getenv('MAIL_PASSWORD')
app.config['MAIL_PASSWORD'] = 'tdvydjjylmixptan'
# os.getenv('EMAIL_USER')
app.config['MAIL_DEFAULT_SENDER'] = 'akkajobfinderservice@gmail.com'


# create the tables if not exists
@app.before_first_request
def create_tables():
    db.create_all()
    removed_jobs = remove_expired_jobs()
    print(removed_jobs)
    expired_tokens = remove_expired_tokens()
    print(expired_tokens)
    expired_memberships = remove_expired_membership()
    print(expired_memberships)


# @app.before_request
# def clean_up_database():
#     removed_jobs = remove_expired_jobs()
#     print(removed_jobs)

# Using an `after_request` callback, we refresh any token that is within 30
# minutes of expiring. Change the timedeltas to match the needs of your application.


@app.after_request
def refresh_expiring_jwts(response):

    try:
        # Expiration time of the current token
        exp_timestamp = get_jwt()['exp']

        now = datetime.now(timezone.utc)
        # Current time + x (mins)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))

        # Refresh the token if Current time > Expiration time
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)

        return response
    except (RuntimeError, KeyError):
        # If Expiration time > Current time that means the token is no longer valid.
        # The user must login again to get a new valid token.
        return response


# Customize error message when no token is present
@jwt.unauthorized_loader
def my_expired_token_callback(response):
    print(response)
    return {'message': 'Invalid token'}, 401


# API endpoints start with http://localhost:5000/...
# users
api.add_resource(User, '/user/get-all-users')
api.add_resource(Register, '/user/register')
api.add_resource(UpdateProfile, '/user/update')
api.add_resource(Login, '/user/login')
api.add_resource(RecoverPasswordURL, '/user/send-recovery-url')
api.add_resource(ResetPassword, '/user/reset-password')
api.add_resource(Delete, '/user/delete')
api.add_resource(Logout, '/user/logout')
api.add_resource(Protected, '/user/protected')
# candidates
api.add_resource(UpdateCandidateProfile, '/candidate/update')
api.add_resource(GetCandidateProfile, '/candidate/get-profile')
# recruiters
api.add_resource(UpdateRecruiterProfile, '/recruiter/update')
api.add_resource(GetRecruiterProfile, '/recruiter/get-profile')
api.add_resource(GetCandidateProfiles, '/recruiter/get-candidate-profiles')
# job
api.add_resource(GetAll, '/job/get-all')
api.add_resource(GetOne, '/job/get-one')
api.add_resource(GetTen, '/job/get-ten')
api.add_resource(GetAllByUID, '/job/get-posted-jobs')
api.add_resource(AddJob, '/job/post')
api.add_resource(UpdateJob, '/job/update')
api.add_resource(DeleteJob, '/job/delete')
api.add_resource(GetSavedJobs, '/job/get-saved-jobs')
api.add_resource(SaveJob, '/job/post-saved-job')
api.add_resource(DeleteSavedJob, '/job/delete-saved-job')
# membership
api.add_resource(AddMembership, '/membership/post')
api.add_resource(GetMembership, '/membership/get')
api.add_resource(UpdateMembership, '/membership/update')
api.add_resource(DeleteMembership, '/membership/delete')
# skills
api.add_resource(AddSkillList, '/skill/post-list')
api.add_resource(AddOne, '/skill/post-one')
api.add_resource(GetAllSkillsByUID, '/skill/get')
api.add_resource(DeleteSkill, '/skill/delete')
api.add_resource(UpdateSkill, '/skill/update')
# education
api.add_resource(GetAllEducationsByUID, '/education/get-all')
api.add_resource(AddEducation, '/education/post-one')
api.add_resource(AddBatchEducations, '/education/post-batch')
api.add_resource(DeleteEducation, '/education/delete')
api.add_resource(UpdateEducation, '/education/update')
# work experience
api.add_resource(GetAllWorkExperiencesByUID, '/work-experience/get-all')
api.add_resource(AddWorkExperience, '/work-experience/post-one')
api.add_resource(AddBatchWorkExperiences, '/work-experience/post-batch')
api.add_resource(UpdateWorkExperience, '/work-experience/update')
api.add_resource(DeleteWorkExperience, '/work-experience/delete')
# applications
api.add_resource(GetAllApplicationsByUID, '/application/get-all')
api.add_resource(GetAllApplicationsByJobID, '/application/get-all-by-job-id')
api.add_resource(AddApplication, '/application/post-one')
api.add_resource(UpdateApplication, '/application/update')
api.add_resource(DeleteApplication, '/application/delete')
# search
api.add_resource(SearchByLocationAndTitle, '/search/title-and-location')
api.add_resource(SearchBySkills, '/search/skills')

if __name__ == '__main__':
    db.init_app(app)
    mail.init_app(app)
    app.run(port=5000, debug=True)
