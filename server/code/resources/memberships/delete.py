from flask_restful import Resource
from models.membership_model import MembershipModel
from flask_jwt_extended import get_jwt_identity, jwt_required
from sqlalchemy.exc import SQLAlchemyError
from flask_smorest import abort


class DeleteMembership(Resource):

    @classmethod
    @jwt_required()
    def delete(cls):
        if get_jwt_identity().get('role') != 'recruiter':
            abort(401, message='You are not authorized to access this route')

        # Get membership information
        if not MembershipModel.find_by_uid(get_jwt_identity().get('user_id')):
            abort(404, message='You have not subscribed to any membership yet.')

        try:
            user_id = get_jwt_identity().get('user_id')
            MembershipModel.delete_from_db(user_id)
        except SQLAlchemyError as e:
            print(e)
            abort(500, message='An error occurred while deleting the job.')

        return {'message': 'Membership deleted successfully'}, 200
