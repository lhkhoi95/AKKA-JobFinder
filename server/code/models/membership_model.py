from db import db
from sqlalchemy.types import Date
from datetime import date
import datetime

# Database model for the Membership table


class MembershipModel(db.Model):
    __tablename__ = 'memberships'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(80), nullable=False)
    start_date = db.Column(Date(), nullable=True)
    expiration_date = db.Column(Date(), nullable=True)
    price = db.Column(db.Float(precision=2), nullable=False)

    # foreign key to user id.
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'),
                        nullable=False)

    # return a string representation of the object
    def __repr__(self):
        return str({column.name: getattr(self, column.name) for column in self.__table__.columns})

    # constructor that initializes the object
    def __init__(self, type, price, user_id):
        self.type = type
        self.start_date = date.today()
        if type.lower() == 'monthly':
            self.expiration_date = date.today() + datetime.timedelta(days=30)
        elif type.lower() == 'semi-annual':
            self.expiration_date = date.today() + datetime.timedelta(days=180)
        elif type.lower() == 'annual':
            self.expiration_date = date.today() + datetime.timedelta(days=365)
        self.price = price
        self.user_id = user_id

    # dictionary representation of the object
    def to_dict(self):
        return {column.name: str(getattr(self, column.name)) for column in self.__table__.columns}

    # save the object to the database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete a user from the database with the given id
    @classmethod
    def delete_from_db(cls, user_id):
        db.session.delete(cls.query.filter_by(user_id=user_id).first())
        db.session.commit()

    # remove all expired memberships.
    def remove_expired_memberships():
        expired_memberships = MembershipModel.query.filter(
            MembershipModel.expiration_date < date.today()).all()

        for membership in expired_memberships:
            membership.delete_from_db()

    # find membership by user id
    @classmethod
    def find_by_uid(cls, user_id):
        # Check expiration date before returning membership
        membership = cls.query.filter(
            cls.expiration_date > date.today()).filter_by(user_id=user_id).first()

        return membership

    # update the current membership with the given plan.
    @classmethod
    def update(cls, user_id=user_id, **kwargs):
        membership = cls.query.filter_by(user_id=user_id).first()
        if membership:
            # update membership based on type
            if membership.type.lower() == 'monthly':
                membership.expiration_date = date.today() + datetime.timedelta(days=30)
            elif membership.type.lower() == 'semi-annual':
                membership.expiration_date = date.today() + datetime.timedelta(days=180)
            elif membership.type.lower() == 'annual':
                membership.expiration_date = date.today() + datetime.timedelta(days=365)
            membership.type = kwargs['type']
            membership.price = kwargs['price']
            membership.save_to_db()
        return None
