from db import db

# Database model for the application table


class ApplicationModel(db.Model):
    __tablename__ = 'applications'
    id = db.Column(db.Integer(), primary_key=True)
    status = db.Column(db.String(80), nullable=False)

    # Foreign key to candidate id.
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    # Foreign key to job id.
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)

    # return a string representation of the object
    def __repr__(self):
        return str({column.name: getattr(self, column.name) for column in self.__table__.columns})

    # constructor that initializes the object
    def __init__(self, status, user_id, job_id):
        self.status = status
        self.user_id = user_id
        self.job_id = job_id

    # return a dictionary representation of the object
    def to_dict(self):
        return {column.name: str(getattr(self, column.name)) for column in self.__table__.columns}

    # save the object to the database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete a user from the database with the given id
    @classmethod
    def delete_by_id(cls, _id):
        db.session.delete(cls.query.filter_by(id=_id).first())
        db.session.commit()

    # find all users in the database
    @classmethod
    def find_all(cls):
        applications = cls.query.all()

        return applications

    # find a user in the database with the given id
    @classmethod
    def find_by_user_id(cls, user_id):
        applications = cls.query.filter_by(user_id=user_id).all()

        return applications

    # find an application in the database with the given job id
    @classmethod
    def find_one_by_job_id(cls, job_id):
        application = cls.query.filter_by(job_id=job_id).first()

        return application

    # find all applications in the database with the given job id
    @classmethod
    def find_by_job_id(cls, job_id):
        applications = cls.query.filter_by(job_id=job_id).all()

        return applications

    # find an application in the database with the given id
    @classmethod
    def find_by_application_id(cls, application_id):
        application = cls.query.filter_by(id=application_id).first()

        return application

    # check if the current user has applied to the job
    @classmethod
    def user_applied(cls, user_id, job_id):
        application = cls.query.filter_by(
            user_id=user_id, job_id=job_id).first()
        if application:
            return True

    # update the status of the application
    @classmethod
    def update(cls, **kwargs):
        application = cls.query.filter_by(id=kwargs['application_id']).first()
        if application:
            for key, value in kwargs.items():
                setattr(application, key, value)

            application.save_to_db()
            return application

        return None

    # check if the current user is an owner of the job
    @classmethod
    def is_owner(cls, user_id, application_id):
        application = cls.query.filter_by(id=application_id).first()
        if application:
            if application.user_id == user_id:
                return True

        return False
