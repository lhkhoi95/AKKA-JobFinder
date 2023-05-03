from db import db
from sqlalchemy.types import Date

# Database model for the WorkExperience table


class WorkExperienceModel(db.Model):
    __tablename__ = 'work_experience'
    id = db.Column(db.Integer(), primary_key=True)
    company_name = db.Column(db.String(80), nullable=False)
    position = db.Column(db.String(80), nullable=False)
    current_job = db.Column(db.Boolean(), nullable=True)
    start_date = db.Column(Date(), nullable=True)
    end_date = db.Column(Date(), nullable=True)
    description = db.Column(db.Text(), nullable=True)
    location = db.Column(db.Text(), nullable=True)

    # Foreign key to user id.
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=False)  # foreign key to user id.

    # string representation of the object
    def __repr__(self):
        return str({column.name: getattr(self, column.name) for column in self.__table__.columns})

    # constructor that initializes the object
    def __init__(self, company_name, location, position, user_id, current_job=None, description=None, start_date=None, end_date=None):
        self.company_name = company_name
        self.position = position
        self.location = location
        self.current_job = current_job
        self.start_date = start_date
        self.end_date = end_date
        self.description = description
        self.user_id = user_id

    # dictionary representation of the object
    def to_dict(self):
        return {column.name: str(getattr(self, column.name)) for column in self.__table__.columns}

    # save the object to the database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete a work experience from the database with the given id
    @classmethod
    def delete_by_id(cls, _id):
        db.session.delete(cls.query.filter_by(id=_id).first())
        db.session.commit()

    # find all work experiences in the database
    @classmethod
    def find_all(cls):
        work_experiences = cls.query.all()

        return work_experiences

    # find all work experiences of the current user
    @classmethod
    def find_all_by_user_id(cls, user_id):
        work_experiences = cls.query.filter_by(user_id=user_id).all()

        return work_experiences

    # find a work experience by work id
    @classmethod
    def find_by_work_id(cls, work_id):
        work_experiences = cls.query.filter_by(id=work_id).first()

        return work_experiences

    # update a work experience.
    @classmethod
    def update(cls, **kwargs):
        work = cls.find_by_work_id(kwargs['id'])
        if work:
            for key, value in kwargs.items():
                setattr(work, key, value)

            work.save_to_db()
            return work

        return None

    # check if the work experience exists.
    @classmethod
    def exists(cls, id_list):
        for _id in id_list:
            if not cls.query.filter_by(id=_id).first():
                return False

        return True
