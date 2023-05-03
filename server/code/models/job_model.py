from models.recruiter_model import RecruiterModel
from models.application_model import ApplicationModel
from db import db
from sqlalchemy.types import Date
import datetime

# Database model for the SavedJob table


class SavedJobModel(db.Model):
    __tablename__ = 'saved_jobs'
    id = db.Column(db.Integer, primary_key=True)

    # Create a relationship between the SavedJobModel and JobModel
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    # Create a relationship between the SavedJobModel and UserModel
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    # constructor that initializes the object
    def __init__(self, job_id, user_id):
        self.job_id = job_id
        self.user_id = user_id

    # a dictionary representation of the object
    def to_dict(self):
        return {column.name: str(getattr(self, column.name)) for column in self.__table__.columns}

    # save the object to the database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete a user from the database with the given id
    @classmethod
    def delete_by_id(cls, _id):
        cls.query.filter_by(id=_id).delete()
        db.session.commit()

    # check if a job is saved by a user
    @classmethod
    def job_was_saved(cls, job_id, user_id):
        job = cls.query.filter_by(job_id=job_id, user_id=user_id).first()

        if job:
            return True

        return False

    # find all saved jobs in the database
    @classmethod
    def find_all_job_company_by_title(cls, job_title):
        job_company = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            filter(JobModel.title.like(f'%{job_title}%')).\
            all()

        return job_company

    # find all saved jobs in the database
    @classmethod
    def find_all_by_uid(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    # find all saved jobs in the database
    @classmethod
    def find_one_by_saved_job_id(cls, saved_job_id):
        return cls.query.filter_by(id=saved_job_id).first()

# Database model for the Job table


class JobModel(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(80), nullable=False)
    start_date = db.Column(Date(), nullable=False)
    end_date = db.Column(Date(), nullable=False)
    location = db.Column(db.String(80), nullable=False)
    type = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    experience_level = db.Column(db.String(80), nullable=False)
    salary_min = db.Column(db.Integer(), nullable=False)
    salary_max = db.Column(db.Integer(), nullable=False)
    description = db.Column(db.Text(), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=False)  # foreign key to user id.
    # Create a relationship between the job and application.
    applications = db.relationship(
        'ApplicationModel', backref='jobs', lazy=True, cascade='all, delete-orphan')

    # Create a relationship between the SavedJobModel and JobModel
    saved_jobs = db.relationship(
        'SavedJobModel', backref='jobs', lazy=True, cascade='all, delete-orphan')

    # return a string representation of the object
    def __repr__(self):
        return str({column.name: getattr(self, column.name) for column in self.__table__.columns})

    # constructor that initializes the object
    def __init__(self, title, description, location, category, type, experience_level, salary_min, salary_max, start_date, end_date, user_id):
        self.title = title
        self.description = description
        self.location = location
        self.type = type
        self.category = category
        self.experience_level = experience_level
        self.salary_min = salary_min
        self.salary_max = salary_max
        self.start_date = start_date
        self.end_date = end_date
        self.user_id = user_id

    # a dictionary representation of the object
    def to_dict(self):
        return {column.name: str(getattr(self, column.name)) for column in self.__table__.columns}

    # save the object to the database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete a user from the database with the given id
    @classmethod
    def delete_from_db(cls, _id):
        db.session.delete(cls.query.filter_by(id=_id).first())
        db.session.commit()

    # remove all expired jobs from the database
    @classmethod
    def remove_expired_jobs(cls):
        expired_jobs = cls.query.filter(
            cls.end_date < datetime.datetime.now()).all()
        for job in expired_jobs:
            job.delete_from_db()

    # find all jobs in the database
    @classmethod
    def find_all_job_company(cls):
        jobs_company = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            all()

        return jobs_company

    # find all jobs in the database by the given job title
    @classmethod
    def find_all_job_company_by_job_title(cls, job_title):
        jobs_company = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            filter(JobModel.title.like(f'%{job_title}%')).\
            all()

        return jobs_company

    # find all jobs in the database by the given location
    @classmethod
    def find_all_job_company_by_location(cls, location):
        jobs_company = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            filter(JobModel.location.like(f'%{location}%')).\
            all()

        return jobs_company

    # find all jobs in the database by the given job title and location
    @classmethod
    def find_all_job_company_by_title_location(cls, job_title, location):
        if job_title and not location:
            return cls.find_all_job_company_by_job_title(job_title)

        if location and not job_title:
            return cls.find_all_job_company_by_location(location)

        jobs_company = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            filter(JobModel.title.like(f'%{job_title}%')).\
            filter(JobModel.location.like(f'%{location}%')).\
            all()

        return jobs_company

    # find all jobs in the database by the given job id
    @classmethod
    def find_ten_job_company(cls, offset):
        """
        Return 10 jobs in the database starting from index (offset + 1)
        The front end should keep track of the offset and increment it by 10 each time the user scrolls down or presses load more.
        """
        jobs_company = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            offset(offset).limit(10).all()

        return jobs_company

    # find all jobs in the database by the given user id
    @classmethod
    def find_all_job_company_by_uid(cls, user_id):
        applications = ApplicationModel.find_by_user_id(user_id)
        if len(applications) == 0:
            jobs_company = JobModel.query.\
                join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
                add_columns(RecruiterModel).\
                filter(JobModel.end_date > datetime.datetime.now()).\
                filter(JobModel.user_id == user_id).\
                all()

            return jobs_company

        # Join the JobModel table with the RecruiterModel table where user_id = user_id.
        jobs_company_application = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            join(ApplicationModel, JobModel.id == ApplicationModel.job_id).\
            add_columns(RecruiterModel, ApplicationModel).\
            order_by(JobModel.id).\
            filter(JobModel.user_id == user_id).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            all()

        return jobs_company_application

    # find all jobs in the database by the given user id
    @classmethod
    def find_all_jobs_by_uid(cls, user_id):
        return cls.query.filter_by(user_id=user_id).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            all()

    # find a job with the given job id
    @classmethod
    def find_by_job_id(cls, job_id):
        return cls.query.filter_by(id=job_id).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            first()

    # find a job with the given application id
    @classmethod
    def find_one_job_company_application(cls, id):
        applications = ApplicationModel.find_by_job_id(id)
        if len(applications) == 0:
            jobs_company = JobModel.query.\
                join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
                add_columns(RecruiterModel).\
                filter(JobModel.end_date > datetime.datetime.now()).\
                filter(JobModel.id == id).\
                all()

            return jobs_company
        # Join the JobModel table with the RecruiterModel table where job_id = id.
        job_company_applications = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            join(ApplicationModel, JobModel.id == ApplicationModel.job_id).\
            add_columns(RecruiterModel, ApplicationModel).\
            filter(JobModel.id == id).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            all()

        return job_company_applications

    # find a job with the given job id
    @classmethod
    def find_one_job_company_by_job_id(cls, job_id):
        return cls.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            filter(JobModel.id == job_id).\
            first()

    # update a job.
    @classmethod
    def update(cls, **kwargs):
        job = cls.query.filter_by(id=kwargs['job_id']).first()
        if job:
            for key, value in kwargs.items():
                setattr(job, key, value)

            job.save_to_db()
            return job

        return None

    # check if the user owns the job.
    @ classmethod
    def is_owner(cls, user_id, job_id):
        job = cls.query.filter_by(id=job_id).first()
        if job:
            if job.user_id == user_id:
                return True
            return False

        return False
    # Testing join tables

    @classmethod
    def get_joined_table(cls, job_title, location):
        # Join the JobModel table with the RecruiterModel table.
        job_company = JobModel.query.\
            join(RecruiterModel, JobModel.user_id == RecruiterModel.user_id).\
            add_columns(RecruiterModel).\
            filter(JobModel.end_date > datetime.datetime.now()).\
            filter(JobModel.title.like(f'%{job_title}%')).\
            filter(JobModel.location.like(f'%{location}%')).\
            all()

        return job_company
