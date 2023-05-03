import hashlib

# return the hash password.


def hash_password(pw):
    salt = "5gz"
    db_password = pw + salt
    h = hashlib.md5(db_password.encode())
    return h.digest()
