from flask_restful import Resource, reqparse
from models.user_model import UserModel
from models.password_recovery import PasswordRecovery
from itsdangerous import URLSafeSerializer
from dotenv import load_dotenv
from flask_mail import Message
from helpers import mail
import os
import datetime
from security import hash_password
from flask_smorest import abort
from flask import request
from marshmallow import Schema, fields

load_dotenv()


class RecoverPasswordURL(Resource):

    @classmethod
    def get(cls):
        data = request.args.get('email')

        # check if email exists
        email = UserModel.find_by_email(data)
        if email is None:
            abort(404, message='Email not found')

        # generate reset token and send email
        reset_token = URLSafeSerializer(
            os.getenv('URLSafeSerializer_SECRET_KEY')).dumps(data)

        msg = Message('You have requested a password reset',
                      recipients=[data, 'lhkhoi95@gmail.com'])

        link = f'http://localhost:3000/account/reset-password?token={reset_token}'

        msg.html = "Please click on this link to reset your password: <br>" + \
            f"<a href='{link}'>{link}</a>" + \
            "<br> This link will be expired in 30 minutes." + \
            "<br> If you did not request a password reset, please ignore this email." + \
            "<br> Thank you."

        try:
            mail.send(msg)
        except:
            abort(500, message='Error sending email')

        # save user_id to password_reset table with 30 minute expiry if token is not already exists
        token = PasswordRecovery.find_by_token(reset_token)
        # if token is already exists, update the expiry time
        if token:
            token.time_expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
            token.save_to_db()
        else:
            new_token = PasswordRecovery(reset_token)
            new_token.save_to_db()

        # return the message to client
        return {'message': 'Successfully sent reset url to the requested email.', 'resetUrl': link}, 200


class ResetPasswordSchema(Schema):
    reset_token = fields.Str(required=True)
    new_password = fields.Str(required=True)


class ResetPassword(Resource):

    @classmethod
    def post(cls):
        errors = ResetPasswordSchema().validate(request.get_json())
        if errors:
            abort(400, message=errors)

        data = request.get_json()

        # check if token is valid
        reset_token = PasswordRecovery.find_by_token(data['reset_token'])

        if reset_token is None:
            return {'message': 'Invalid token'}, 400

        # check if token is expired
        if reset_token.time_expire < datetime.datetime.utcnow():
            return {'message': 'Token has expired'}, 400

        # decrypt the email from the token
        email = URLSafeSerializer(
            os.getenv('URLSafeSerializer_SECRET_KEY')).loads(data['reset_token'])

        # find the user with this email
        user = UserModel.find_by_email(email)

        # check if email exists
        if user is None:
            abort(404, message='Email not found')

        # update the password
        user.password = hash_password(data["new_password"])
        user.save_to_db()

        # delete the token from password_reset table
        reset_token.delete_from_db()

        return {'message': 'Password has been updated'}, 200
