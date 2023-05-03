from db import db
import uuid

# Database for the user table


class UserModel(db.Model):
    __tablename__ = 'users'
    id = db.Column('id', db.Text(length=36), default=lambda: str(
        uuid.uuid4()), primary_key=True)
    email = db.Column(db.Text, nullable=False, unique=True)
    password = db.Column(db.String(), nullable=False)
    role = db.Column(db.String(), nullable=False)

    # Create a relationship between User and CandidateModel
    candidate = db.relationship(
        'CandidateModel', backref='users', lazy=True, cascade='all, delete-orphan')

    # Create a relationship between User and RecruiterModel
    recruiter = db.relationship('RecruiterModel', backref='users',
                                lazy=True, cascade='all, delete-orphan')

    # Create a relationship between User and JobModel
    jobs = db.relationship('JobModel', backref='users',
                           lazy=True, cascade='all, delete-orphan')

    # Create a relationship between User and MembershipModel
    memberships = db.relationship(
        'MembershipModel', backref='users', lazy=True, cascade='all, delete-orphan')

    # Create a relationship between User and EducationModel
    educations = db.relationship(
        'EducationModel', backref='users', lazy=True, cascade='all, delete-orphan')

    # Create a relationship between User and SkillModel
    skills = db.relationship(
        'SkillModel', backref='users', lazy=True, cascade='all, delete-orphan')

    # Create a relationship between User and WorkExperienceModel
    work_experiences = db.relationship(
        'WorkExperienceModel', backref='users', lazy=True, cascade='all, delete-orphan')

    # Create a relationship between the User and ApplicationModel.
    applications = db.relationship(
        'ApplicationModel', backref='users', lazy=True, cascade='all, delete-orphan')

    # Create a relationship between the SavedJobModel and UserModel
    saved_jobs = db.relationship(
        'SavedJobModel', backref='users', lazy=True, cascade='all, delete-orphan')

    # return a string representation of the object
    def __repr__(self):
        return str({column.name: getattr(self, column.name) for column in self.__table__.columns})

    # constructor that initializes the object
    def __init__(self, email, password, role):
        self.email = email
        self.password = password
        self.role = role

    # dictionary representation of the object
    def to_dict(self):
        return {column.name: str(getattr(self, column.name)) for column in self.__table__.columns}

    # save the object to the database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete a user from the database with the given id
    @classmethod
    def delete_by_id(cls, _id):
        user = cls.query.filter_by(id=_id).first()
        db.session.delete(user)
        db.session.commit()

    # find all users in the database
    @classmethod
    def find_all(cls):
        return cls.query.all()

    # find a user by email
    @classmethod
    def find_by_email(cls, email):
        return cls.query.filter_by(email=email).first()

    # find a user by id
    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()
