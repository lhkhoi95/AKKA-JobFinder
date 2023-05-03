from db import db
import datetime

# Database model for the password recovery table


class PasswordRecovery(db.Model):
    __tablename__ = 'password_recovery'
    id = db.Column(db.Integer(), primary_key=True)
    reset_token = db.Column(db.String(80), nullable=False)
    time_expire = db.Column(db.DateTime(timezone=True))

    # constructor that initializes the object
    def __init__(self, reset_token):
        self.reset_token = reset_token
        self.time_expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)

    # save the object to the database
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    # delete a password recovery from the database.
    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    # find a reset_token in the database with the given reset_token.
    @classmethod
    def find_by_token(cls, token):
        return cls.query.filter_by(reset_token=token).first()

    # remove all expired tokens from the database.
    @classmethod
    def remove_expired_tokens(cls):
        cls.query.filter(cls.time_expire < datetime.datetime.utcnow()).delete()
        db.session.commit()
