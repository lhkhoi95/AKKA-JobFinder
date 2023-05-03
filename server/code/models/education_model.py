from db import db
from sqlalchemy.types import Date


# Database model for the Education table
class EducationModel(db.Model):
    __tablename__ = 'education'
    school_id = db.Column(db.Integer, primary_key=True)
    school_name = db.Column(db.String(80), nullable=False)
    degree = db.Column(db.String(80), nullable=True)
    major = db.Column(db.String(80), nullable=True)
    start_date = db.Column(Date(), nullable=True)
    end_date = db.Column(Date(), nullable=True)
    description = db.Column(db.Text(), nullable=True)

    # Foreign key to user id.
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=False)  # foreign key to user id.

    # return a string representation of the object
    def __repr__(self):
        return str({column.name: getattr(self, column.name) for column in self.__table__.columns})

    # constructor that initializes the object
    def __init__(self, school_name, user_id, degree=None, major=None, start_date=None,  description=None, end_date=None):
        self.school_name = school_name
        self.degree = degree
        self.major = major
        self.start_date = start_date
        self.end_date = end_date
        self.description = description
        self.user_id = user_id

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
        db.session.delete(cls.query.filter_by(school_id=_id).first())
        db.session.commit()

    # find all users in the database
    @classmethod
    def find_all(cls):
        educations = cls.query.all()

        return educations

    # find all educations of the current user
    @classmethod
    def find_all_by_user_id(cls, user_id):
        educations = cls.query.filter_by(user_id=user_id).all()

        return educations

    # find an education in the database with the given school id
    @classmethod
    def find_by_school_id(cls, school_id):
        education = cls.query.filter_by(school_id=school_id).first()

        return education

    # update an education in the database with the given school id
    @classmethod
    def update(cls, **kwargs):
        education = cls.query.filter_by(school_id=kwargs['school_id']).first()
        if education:
            for key, value in kwargs.items():
                setattr(education, key, value)

            education.save_to_db()
            return education

        return None

    # check all school ids exist in the database
    @classmethod
    def exists(cls, id_list):
        for _id in id_list:
            if not cls.query.filter_by(school_id=_id).first():
                return False

        return True
